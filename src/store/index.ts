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
	},
	modules: {
		aaCount: {
			namespaced: true,
			state() {
				return {
					aacount: 0
				};
			},
			getters: {
				aadouble(state) {
					console.log("getter");
					return state.aacount * 2;
				}
			},
			mutations: {
				increment(state) {
					state.aacount++;
				},
				decrement(state) {
					state.aacount--;
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
