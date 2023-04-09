import { createRouter, createWebHashHistory } from "vue-router";
import TestA from "./components/TestA.vue";
import TestB from "./components/TestB.vue";
import App from "./App.vue";

export default createRouter({
	history: createWebHashHistory(),
	routes: [
		{
			path: "/",
			component: App,
			name: "App"
		},
		{ path: "/testa", component: TestA, name: "TestA" },
		{ path: "/testB", component: TestB, name: "TestB" }
	]
});
