import Module from "./module/module";

export function installModule(
	state: any,
	module: Module<any>,
	path: string[],
	parentState = state
) {
	if (path.length) {
		const name = path[path.length - 1];
		parentState[name] = state;
	}

	module.forEachChild((child, name) => {
		installModule(child.state, child, path.concat(name), state);
	});
}
