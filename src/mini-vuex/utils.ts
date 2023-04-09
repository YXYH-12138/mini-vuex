export const isFunction = (val: unknown): val is Function => typeof val === "function";
export const isObject = (val: unknown): val is Record<any, any> =>
	typeof val === "object" && val !== null;

export const isPromise = (val: unknown) => val && isFunction((val as any)?.then);

export type Fn<V = any, K = string> = (value: V, key: K) => void;

export function forEachValue(data: Record<any, any>, fn: (value: any, key: string) => void) {
	data && Object.keys(data).forEach((key) => fn(data[key], key));
}
