<template>
	<div class="navbar">
		<div class="tab" v-for="tab in tabs">
			<NuxtLink :to="tab.to">
				{{ tab.label }}
			</NuxtLink>
		</div>
	</div>
</template>
<script setup lang="ts">
interface TabEntry {
	to: string;
	label: string;
}Home2
const tabs: TabEntry[] = [
	{to: "/", label: "Home"},
	{to: "/about", label: "About"},
];
</script>
<style scoped>
.navbar {
	padding: 0.6em 1em 0.6em 1em;
	background-color: var(--background-alt);
	display: flex;
}

.tab {
	padding-left: 1em;
	padding-right: 1em;
}
</style>
