import { type StoreOptions } from "../store";
import Module from "./module";
import { forEachValue } from "../utils";

export default class ModuleCollection<S> {
	root!: Module<S>;

	constructor(rawModule: StoreOptions<S>) {
		this.register(rawModule, []);
	}

	getNamespace(path: string[]) {
		let module = this.root;
		return path.reduce((namespace, key) => {
			module = module.getChild(key);
			return namespace + (module.namespaced ? key + "/" : "");
		}, "");
	}

	/**
	 * 注册模块，构建模块树
	 * @param rawModule
	 * @param path
	 * @param parent
	 */
	register(rawModule: StoreOptions<S>, path: string[], parent?: Module<any>) {
		const module = new Module(rawModule);

		if (!this.root) {
			this.root = module;
		} else {
			const name = path[path.length - 1];
			parent!.addChild(name, module);
		}

		// 递归注册模块
		rawModule.modules &&
			forEachValue(rawModule.modules, (value, key) => {
				this.register(value, path.concat(key), module);
			});
	}
}
