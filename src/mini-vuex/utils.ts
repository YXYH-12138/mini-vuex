export const isFunction = (val: unknown): val is Function => typeof val === "function";
export const isObject = (val: unknown): val is Record<any, any> =>
	typeof val === "object" && val !== null;

export function forEachValue(data: Record<any, any>, fn: (value: any, key: string) => void) {
	Object.keys(data).forEach((key) => fn(data[key], key));
}
