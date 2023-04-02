<template>
	<div>counter: {{ counterA }}</div>
	<div>count: {{ $store.state.aCount.count }}</div>
	<div>double: {{ store.getters["aCount/double"] }}</div>
	<button @click="handleAdd">+1</button>
	<button @click="handleSub">-1</button>
	<button @click="handleAsyncAdd">async +1</button>
	<hr />
	<!-- <div>counter: {{ counterB }}</div>
	<div>count: {{ $store.state.aCount.aaCount.aacount }}</div>
	<div>double: {{ store.getters["aCount/aaCount/aadouble"] }}</div>
	<button @click="handleAdd">+1</button>
	<button @click="handleSub">-1</button>
	<button @click="handleAsyncAdd">async +1</button> -->
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "./store";

const store = useStore();

const counterA = computed(() => {
	return store.state.aCount.count;
});
const counterB = computed(() => {
	return store.state.aCount.aaCount.aacount;
});

function handleAdd() {
	store.commit("aCount/increment");
	store.commit({ type: "aCount/increment" });
}
function handleSub() {
	store.commit("aCount/decrement");
	store.commit({ type: "bCount/decrement" });
}
function handleAsyncAdd() {
	store.dispatch("aCount/asyncIncrement").then(() => {
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
