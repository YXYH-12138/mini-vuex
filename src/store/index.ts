import type { InjectionKey } from "vue";
// import { createStore, useStore as useBaseStore, type Store } from "../mini-vuex";
import { createStore, useStore as useBaseStore, type Store } from "vuex";

interface State {
	count: number;
}

export const key: InjectionKey<Store<State>> = Symbol();

export const store = createStore<State>({
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
			console.log(this);
			setTimeout(() => {
				commit("increment");
			}, 1000);
		}
	}
});

export function useStore() {
	return useBaseStore(key);
}
