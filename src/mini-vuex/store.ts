import { storeKey } from "./injectKey";
import ModuleCollection from "./module/module-collection";
import { installModule, unifyObjectStyle, resetStoreState } from "./store-util";
import type { EffectScope, App, InjectionKey } from "vue";

export interface Payload {
	type: string;
}

export interface Commit {
	(type: string, payload?: any): void;
	<P extends Payload>(payloadWithType: P): void;
}
export interface Dispatch {
	(type: string, payload?: any): Promise<any>;
	<P extends Payload>(payloadWithType: P): Promise<any>;
}

export interface ActionContext<S, R> {
	dispatch: Dispatch;
	commit: Commit;
	state: S;
	getters: any;
	rootState: R;
	rootGetters: any;
}

export type Getter<S, R> = (state: S, getters: any, rootState: R, rootGetters: any) => any;
export type Mutation<S> = (state: S, payload?: any) => any;
export type ActionHandler<S, R> = (
	this: Store<R>,
	inject: ActionContext<S, R>,
	payload?: any
) => any;

export interface GetterTree<S, R> {
	[key: string]: Getter<S, R>;
}
export interface MutationTree<S> {
	[key: string]: Mutation<S>;
}
export interface ActionTree<S, R> {
	[key: string]: ActionHandler<S, R>;
}
export interface ModuleTree<R> {
	[key: string]: Module<any, R>;
}
export interface Module<S, R> {
	namespaced?: boolean;
	state?: S | (() => S);
	getters?: GetterTree<S, R>;
	actions?: ActionTree<S, R>;
	mutations?: MutationTree<S>;
	modules?: ModuleTree<R>;
}

export interface StoreOptions<S> {
	state?: S | (() => S);
	getters?: GetterTree<S, S>;
	actions?: ActionTree<S, S>;
	mutations?: MutationTree<S>;
	modules?: ModuleTree<S>;
	namespaced?: boolean;
}

export class Store<S> {
	_state!: { data: S };
	getters!: Record<string, any>;
	_mutations: Record<string, Mutation<S>[]>;
	_actions: Record<string, Array<(payload: any) => any>>;
	_wrappedGetters: Record<string, Getter<S, S>>;
	_makeLocalGettersCache: Record<string, Record<string, any>>;
	_modules: ModuleCollection<S>;

	_scope: EffectScope | undefined;

	get state() {
		return this._state.data;
	}

	constructor(options: StoreOptions<S>) {
		// 初始化类部数据
		this._mutations = Object.create(null);
		this._actions = Object.create(null);
		this._wrappedGetters = Object.create(null);
		this._makeLocalGettersCache = Object.create(null);

		// 会在在ModuleCollection中递归构建模块树
		this._modules = new ModuleCollection(options);

		// 根状态
		const state = this._modules.root.state;

		// 安装模块
		installModule(this, state, this._modules.root, []);
		// 初始化响应式数据和getter
		resetStoreState(this, state);

		// this.rootState = state;
		console.log(this);
	}

	install(app: App, key?: InjectionKey<Store<any>> | string) {
		app.provide(key || storeKey, this);
		app.config.globalProperties.$store = this;
	}

	commit: Commit = (_type: string | Payload, _payload?: any) => {
		const { type, payload } = unifyObjectStyle(_type, _payload);
		const entrys = this._mutations[type];
		if (!entrys) {
			if (process.env.NODE_ENV) {
				console.error(`[vuex] unknown mutation type: ${type}`);
			}
			return;
		}
		entrys.forEach((fn) => fn(payload));
	};

	dispatch: Dispatch = (_type: string | Payload, _payload?: any) => {
		const { type, payload } = unifyObjectStyle(_type, _payload);
		const entrys = this._actions[type];
		if (!entrys) {
			if (process.env.NODE_ENV) {
				console.error(`[vuex] unknown action type: ${type}`);
			}
			return Promise.reject();
		}
		return Promise.all(entrys.map((fn) => fn(payload)));
	};
}

export function createStore<S>(options: StoreOptions<S>) {
	return new Store(options);
}
