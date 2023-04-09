import { computed, type ComputedRef, effectScope, reactive } from "vue";
import Module from "./module/module";
import { forEachValue, isObject, isPromise } from "./utils";
import type { Mutation, Store, Dispatch, Commit, ActionHandler, Getter } from "./store";

interface LocalContext {
	dispatch: Dispatch;
	commit: Commit;
	getters: Record<string, any>;
	state: Record<string, any>;
}

/**
 * 模块安装
 * @param store Store类
 * @param state 当前state
 * @param module 当前模块
 * @param path 嵌套模块路径
 * @param parentState 父级state
 */
export function installModule(
	store: Store<any>,
	state: any,
	module: Module<any>,
	path: string[],
	parentState = state
) {
	const namespace = store._modules.getNamespace(path);

	if (path.length) {
		const moduleName = path[path.length - 1];
		parentState[moduleName] = state;
	}

	const local = makeLocalContext(store, namespace, path);

	module.forEachMutation((mutation, key) => {
		const namespacedType = namespace + key;
		registerMutation(store, namespacedType, mutation, local);
	});

	// TODO:action还有一个Object的提交方式未处理
	module.forEachAction((action, key) => {
		const namespacedType = namespace + key;
		registerAction(store, namespacedType, action, local);
	});

	module.forEachGetter((getter, key) => {
		const namespacedType = namespace + key;
		registerGetter(store, namespacedType, getter, local);
	});

	module.forEachChild((child, name) => {
		installModule(store, child.state, child, path.concat(name), state);
	});
}

export function resetStoreState(store: Store<any>, state: any) {
	const oldScope = store._scope;

	store._state = reactive({ data: state });
	store.getters = Object.create(null);
	store._makeLocalGettersCache = Object.create(null);

	const computedObj: Record<string, any> = {};
	const computedCache: Record<string, ComputedRef<any>> = {};

	// 创建一个新的副作用范围，并在其中创建计算对象以避免 getters (computed)在组件卸载时被销毁。
	const scope = effectScope(true);

	scope.run(() => {
		forEachValue(store._wrappedGetters, (fn, key) => {
			// computedObj[key] = () => fn();
			computedCache[key] = computed(() => {
				console.log("重新执行");
				return fn();
			});
			Object.defineProperty(store.getters, key, {
				get: () => computedCache[key].value,
				enumerable: true
			});
		});
	});

	store._scope = scope;

	oldScope && oldScope.stop();
}

/**
 * 创建一个局部的dispatch, commit, getters and state
 */
function makeLocalContext(store: Store<any>, namespace: string, path: string[]) {
	const noNamespace = namespace === "";

	const local = {
		dispatch: noNamespace
			? store.dispatch
			: (_type, _payload) => {
					const { type, payload } = unifyObjectStyle(_type, _payload);
					return store.dispatch(namespace + type, payload);
			  },
		commit: noNamespace
			? store.commit
			: (_type, _payload) => {
					const { type, payload } = unifyObjectStyle(_type, _payload);
					store.commit(namespace + type, payload);
			  }
	} as LocalContext;

	// getters和state object必须以惰性方式获取，因为此时他们还没有被初始化
	Object.defineProperties(local, {
		getters: {
			get: noNamespace ? () => store.getters : () => makeLocalGetters(store, namespace)
		},
		state: { get: () => getNestedState(store.state, path) }
	});

	return local;
}
function makeLocalGetters(store: Store<any>, namespace: string) {
	if (!store._makeLocalGettersCache[namespace]) {
		const gettersProxy = {};
		const splitPos = namespace.length;

		Object.keys(store.getters).forEach((key) => {
			// 如果目标getter与此名称空间不匹配，则跳过
			if (key.slice(0, splitPos) !== namespace) return;

			// 当前(不包括命名空间的)getter类型
			const type = key.slice(splitPos);

			Object.defineProperty(gettersProxy, type, {
				get: () => store.getters[key],
				enumerable: true
			});

			store._makeLocalGettersCache[namespace] = gettersProxy;
		});
	}
	return store._makeLocalGettersCache[namespace];
}

function registerMutation(
	store: Store<any>,
	type: string,
	handler: Mutation<any>,
	local: LocalContext
) {
	const entry: Array<Mutation<any>> = store._mutations[type] || (store._mutations[type] = []);
	entry.push((payload) => handler.call(store, local.state, payload));
}

function registerAction(
	store: Store<any>,
	type: string,
	handler: ActionHandler<any, any>,
	local: LocalContext
) {
	const entry: Array<(payload: any) => any> = store._actions[type] || (store._actions[type] = []);
	entry.push((payload) => {
		const result = handler.call(
			store,
			{
				dispatch: local.dispatch,
				commit: local.commit,
				state: local.state,
				getters: local.getters,
				rootGetters: store.getters,
				rootState: store.state
			},
			payload
		);
		// 判断action是否返回一个promise
		return isPromise(result) ? result : Promise.resolve();
	});
}

function registerGetter(
	store: Store<any>,
	type: string,
	handler: Getter<any, any>,
	local: LocalContext
) {
	if (store._wrappedGetters[type]) {
		if (process.env.NODE_ENV) {
			console.error(`[vuex] duplicate getter key: ${type}`);
		}
		return;
	}
	store._wrappedGetters[type] = () =>
		handler(local.state, local.getters, store.state, store.getters);
}

function getNestedState(state: any, path: string[]) {
	return path.reduce((acc, cur) => acc[cur], state);
}

export function unifyObjectStyle(type: string | Record<string, any>, payload?: any) {
	let _type: string = type as string;
	if (isObject(type) && type.type) {
		_type = type.type;
		payload = type;
	}

	return { type: _type, payload };
}
