import { type StoreOptions } from "../store";
import Module from "./module";
import { forEachValue } from "../utils";

export default class ModuleCollection<S> {
	public root: Module<S>;

	constructor(options: StoreOptions<S>) {
		this.register(options, []);
	}

	private register(options: StoreOptions<S>, path: string[], parent?: Module<any>) {
		const module = new Module(options);

		if (!this.root) {
			this.root = module;
		} else {
			const name = path[path.length - 1];
			parent!.addChild(name, module);
		}

		options.modules &&
			forEachValue(options.modules, (value, key) => {
				this.register(value, path.concat(key), module);
			});
	}
}
