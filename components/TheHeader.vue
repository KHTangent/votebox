<template>
	<div class="navbar">
		<div class="tab">
			<NuxtLink to="/"> Home </NuxtLink>
		</div>
		<div class="tab">
			<NuxtLink to="/about"> About </NuxtLink>
		</div>
		<div class="tab" v-if="localLogin.length > 0">
			<NuxtLink to="/votings"> My votings </NuxtLink>
		</div>
		<div class="tab" v-if="localLogin.length > 0">
			<NuxtLink to="/create"> Create voting </NuxtLink>
		</div>
		<div class="spacer"></div>
		<div v-if="localLogin.length === 0">
			<NuxtLink to="/login">
				<VBButton> Login </VBButton>
			</NuxtLink>
		</div>
		<div v-else>
			<VBButton @click="logout"> Log out </VBButton>
		</div>
	</div>
</template>

<script setup lang="ts">
let localLogin = useLocalLogin();

async function logout() {
	await $fetch("/api/logout", {
		method: "POST",
		headers: {
			Authorization: "Bearer " + localLogin.value,
		},
	});
	localStorage.clear();
	localLogin.value = "";
	navigateTo({ path: "/" });
}
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
