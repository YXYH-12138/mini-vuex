import type { InjectionKey } from "vue";
import { createStore, useStore as useBaseStore, type Store } from "../mini-vuex";
// import { createStore, useStore as useBaseStore, type Store } from "vuex";

interface State {
	count: number;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore({
	state() {
		return {
			count: 0
		};
	},
	getters: {
		double(state) {
			return state.count * 2;
		}
	},
	mutations: {
		increment(state) {
			state.count++;
		},
		decrement(state) {
			state.count--;
		}
	},
	actions: {
		asyncIncrement({ commit }) {
			return new Promise<void>((resolve) => {
				setTimeout(() => {
					commit("increment");
					resolve();
				}, 1000);
			});
		}
	}
});

export function useStore() {
	return useBaseStore(key);
}
