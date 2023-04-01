export const isFunction = (val: unknown): val is Function => typeof val === "function";
export const isObject = (val: unknown): val is Record<any, any> =>
	typeof val === "object" && val !== null;

export const isPromise = (val: unknown) => val && isFunction((val as any)?.then);

export function forEachValue(data: Record<any, any>, fn: (value: any, key: string) => void) {
	Object.keys(data).forEach((key) => fn(data[key], key));
}

export function unifyObjectStyle(type: string | Record<string, any>, payload?: any) {
	let _type: string = type as string;
	if (isObject(type) && type.type) {
		_type = type.type;
	}

	return { type: _type, payload };
}
