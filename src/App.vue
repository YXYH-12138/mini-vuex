<template>
	<div>counter: {{ counter }}</div>
	<div>count: {{ $store.state.count }}</div>
	<div>double: {{ store.getters.double }}</div>
	<button @click="handleAdd">+1</button>
	<button @click="handleSub">-1</button>
	<hr />
	<button @click="handleAsyncAdd">async +1</button>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "./store";

const store = useStore();

const counter = computed(() => {
	return store.state.count;
});

function handleAdd() {
	store.commit("increment");
	store.commit({ type: "increment" });
}
function handleSub() {
	store.commit("decrement");
	store.commit({ type: "decrement" });
}
function handleAsyncAdd() {
	store.dispatch("asyncIncrement").then(() => {
		console.log(111);
	});
}
</script>

<style lang="scss">
#app {
	width: 100%;
	height: 100%;
	padding: 20px;
	box-sizing: border-box;
}
</style>
