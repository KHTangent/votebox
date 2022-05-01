<template>
	<div class="navbar">
		<div class="tab" v-for="tab in tabs">
			<NuxtLink :to="tab.to">
				{{ tab.label }}
			</NuxtLink>
		</div>
		<div class="spacer"></div>
		<div>
			<NuxtLink to="login">
				<VBButton>
					Login
				</VBButton>
			</NuxtLink>
		</div>
	</div>
</template>

<script setup lang="ts">
interface TabEntry {
	to: string;
	label: string;
}

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
	align-items: center;
}

.tab {
	padding-left: 1em;
	padding-right: 1em;
}

.spacer {
	flex-grow: 1;
}
</style>
