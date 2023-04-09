<template>
	<div>aCount.count: {{ counterA }}</div>
	<div>aCount.count: {{ $store.state.aCount.count }}</div>
	<div>aCount.aaCount.count: {{ $store.state.aCount.aaCount.count }}</div>
	<div>aCount/double: {{ store.getters["aCount/double"] }}</div>
	<div>aCount/double: {{ store.getters["aCount/aaCount/double"] }}</div>
	<button @click="handleAdd('aCount/increment')">aCount+1</button>
	<button @click="handleSub('aCount/decrement')">aCount-1</button>
	<button @click="handleAdd('aCount/aaCount/increment')">aCount.aaCount+1</button>
	<button @click="handleSub('aCount/aaCount/decrement')">aCount.aaCount-1</button>
	<button @click="handleAsyncAdd">async +1</button>
	<hr />
</template>

<script setup lang="ts">
import { computed } from "vue";
import { useStore } from "../store";

const store = useStore();

const counterA = computed(() => {
	return store.state.aCount.count;
});

function handleAdd(type: string) {
	// console.log(store.getters["double"]);
	store.commit(type, 1);
	// store.commit({ type: "aCount/increment" });
	// store.commit("increment", 1);
	// store.commit({ type: "increment" });
}
function handleSub(type: string) {
	// store.commit("decrement");
	// store.commit({ type: "decrement" });
	store.commit(type);
	// store.commit({ type: "bCount/decrement" });
}

function handleAsyncAdd() {
	store.dispatch("aCount/asyncIncrement").then(() => {
		console.log(111);
	});
}
</script>
