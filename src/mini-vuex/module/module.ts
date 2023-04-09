import { type Fn, forEachValue, isFunction } from "../utils";
import type { ActionHandler, Getter, Mutation, StoreOptions } from "../store";

/**
 * 存储模块的基本数据结构，属性和方法
 */
export default class Module<S> {
	state: S;

	_rawModule: StoreOptions<S>;
	_children: Record<string, Module<S>>;

	constructor(rawModule: StoreOptions<S>) {
		const { state: _state } = rawModule;
		this._rawModule = rawModule;
		this.state = (isFunction(_state) ? _state() : _state || {}) as S;
		this._children = Object.create(null);
	}

	get namespaced() {
		return !!this._rawModule.namespaced;
	}

	addChild(key: string, module: Module<S>) {
		this._children[key] = module;
	}

	getChild(key: string) {
		return this._children[key];
	}

	forEachChild(fn: Fn<Module<S>>) {
		forEachValue(this._children, fn);
	}

	forEachAction(fn: Fn<ActionHandler<S, S>>) {
		forEachValue(this._rawModule.actions!, fn);
	}

	forEachMutation(fn: Fn<Mutation<S>>) {
		forEachValue(this._rawModule.mutations!, fn);
	}

	forEachGetter(fn: Fn<Getter<S, S>>) {
		forEachValue(this._rawModule.getters!, fn);
	}
}
