import { type Fn, forEachValue, isFunction } from "../utils";
import type { StoreOptions } from "../store";

/**
 * 存储模块的基本数据结构，属性和方法
 */
export default class Module<S> {
	public state: S;

	private _raw: StoreOptions<S>;
	private _children: Record<string, Module<S>>;

	constructor(options: StoreOptions<S>) {
		const { state: _state } = options;
		this._raw = options;
		this.state = (isFunction(_state) ? _state() : _state || {}) as S;
		this._children = Object.create(null);
	}

	public addChild(key: string, module: Module<S>) {
		this._children[key] = module;
	}

	public forEachChild(fn: Fn<Module<S>>) {
		forEachValue(this._children, fn);
	}
}
