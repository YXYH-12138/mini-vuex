import { inject, type InjectionKey } from "vue";
import { Store } from "./store";

export const storeKey = "store";

export function useStore<S = any>(injectKey?: InjectionKey<Store<S>> | string) {
	return inject(injectKey || storeKey) as Store<S>;
}
