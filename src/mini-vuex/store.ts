import { type App, reactive } from "vue";
import { storeKey } from "./injectKey";
import { forEachValue, isFunction } from "./utils";

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

export interface StoreOptions<S> {
	state?: S | (() => S);
	getters?: GetterTree<S, S>;
	actions?: ActionTree<S, S>;
	mutations?: MutationTree<S>;
}

export class Store<S> {
	private _state = reactive({ data: {} }) as { data: S };
	private _mutations: MutationTree<S> = Object.create(null);
	private _actions: ActionTree<S, S> = Object.create(null);

	public readonly getters: Record<string, any> = {};

	public get state() {
		return this._state.data;
	}

	constructor(options: StoreOptions<S>) {
		const { state, mutations, actions, getters } = options || { state: {} };
		this._state.data = (isFunction(state) ? state() : state) as S;
		Object.assign(this._mutations, mutations);
		Object.assign(this._actions, actions);

		if (getters) {
			forEachValue(getters, (value, key) => {
				Object.defineProperty(this.getters, key, {
					enumerable: true,
					get: () => {
						return value(this.state, this.getters);
					}
				});
			});
		}
	}

	install(app: App, key?: string) {
		app.provide(key || storeKey, this);
		app.config.globalProperties.$store = this;
	}

	public commit: Commit = (data: string | Payload, payload?: any) => {
		if (typeof data === "string") {
			this._mutations[data](this.state, payload);
		} else {
			const { type, ...payload } = data;
			this._mutations[type](this.state, payload);
		}
	};

	public dispatch: Dispatch = async (data: string | Payload, payload?: any) => {
		if (typeof data === "string") {
			this._actions[data].call(this, this, payload);
		} else {
			const { type, ...payload } = data;
			this._actions[type].call(this, this, payload);
		}
	};
}

export function createStore<S>(options: StoreOptions<S>) {
	return new Store(options);
}
