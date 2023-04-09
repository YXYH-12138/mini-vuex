import type { InjectionKey } from "vue";
import { createStore, useStore as useBaseStore, type Store, type Module } from "../mini-vuex";
// import { createStore, Module, useStore as useBaseStore, type Store } from "vuex";

interface ACount {
	count: number;
}

export const key: InjectionKey<Store<any>> = Symbol();

const aCount: Module<ACount, ACount> = {
	namespaced: true,
	state() {
		return {
			count: 0
		};
	},
	getters: {
		double(state, getters) {
			console.log("getter", getters);
			return state.count * 2;
		}
	},
	mutations: {
		increment(state, payload) {
			state.count += payload;
		},
		decrement(state) {
			state.count--;
		}
	},
	actions: {
		asyncIncrement({ commit }) {
			return new Promise<void>((resolve) => {
				setTimeout(() => {
					commit("increment", 1);
					resolve();
				}, 1000);
			});
		}
	},
	modules: {
		aaCount: {
			namespaced: true,
			state() {
				return {
					count: 0
				};
			},
			getters: {
				double(state) {
					console.log("getter");
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
		}
	}
};

const bCount: Module<ACount, ACount> = {
	namespaced: true,
	state() {
		return {
			count: 0
		};
	},
	getters: {
		double(state) {
			console.log("getter");
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
};

export const store = createStore({
	modules: {
		aCount,
		bCount
	}
});

export function useStore() {
	return useBaseStore(key);
}
