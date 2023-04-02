import { type App, reactive, type InjectionKey } from "vue";
import { storeKey } from "./injectKey";
import ModuleCollection from "./module/module-collection";
import { installModule } from "./store-util";
import { isPromise, unifyObjectStyle } from "./utils";

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
	injectee: ActionContext<S, R>,
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
}

export class Store<S> {
	private _state = reactive({ data: {} }) as { data: S };
	private _mutations: MutationTree<S>;
	private _actions: ActionTree<S, S>;

	private _modules: ModuleCollection<S>;

	public readonly getters: Record<string, any> = {};

	public get state() {
		return this._state.data;
	}

	constructor(options: StoreOptions<S>) {
		this._modules = new ModuleCollection(options);
		console.log(this._modules);

		const state = this._modules.root.state;

		installModule(state, this._modules.root, []);

		this._state.data = state;

		// this._state.data = (isFunction(state) ? state() : state || {}) as S;
		// this._mutations = mutations || Object.create(null);
		// this._actions = actions || Object.create(null);

		// getters &&
		// 	forEachValue(getters, (value, key) => {
		// 		Object.defineProperty(this.getters, key, {
		// 			enumerable: true,
		// 			get: () => value(this.state, this.getters)
		// 		});
		// 	});
	}

	install(app: App, key?: InjectionKey<Store<any>> | string) {
		app.provide(key || storeKey, this);
		app.config.globalProperties.$store = this;
	}

	public commit: Commit = (_type: string | Payload, _payload?: any) => {
		const { type, payload } = unifyObjectStyle(_type, _payload);
		this._mutations[type](this.state, payload);
	};

	public dispatch: Dispatch = (_type: string | Payload, _payload?: any) => {
		const { type, payload } = unifyObjectStyle(_type, _payload);
		const result = this._actions[type].call(this, this, payload);
		return isPromise(result) ? result : Promise.resolve();
	};
}

export function createStore<S>(options: StoreOptions<S>) {
	return new Store(options);
}
