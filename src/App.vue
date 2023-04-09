<template>
	<nav>
		<router-link to="/testa">testa</router-link> |
		<router-link to="/testb">testb</router-link>
	</nav>
	<router-view />
</template>

<script setup lang="ts"></script>

<style lang="scss">
html,
body {
	width: 100%;
	height: 100%;
	padding: 0;
	margin: 0;
}
#app {
	width: 100%;
	height: 100%;
	padding: 20px;
	box-sizing: border-box;
}

nav {
	padding: 30px;

	a {
		font-weight: bold;
		color: #2c3e50;

		&.router-link-exact-active {
			color: #42b983;
		}
	}
}
</style>
