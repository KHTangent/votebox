<template>
	<div class="navbar">
		<div class="tab">
			<NuxtLink to="/"> VoteBox </NuxtLink>
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
let localLoginCookie = useCookie("token");

async function logout() {
	localLoginCookie.value = "";
	const temp = localLogin.value.substring(0);
	localLogin.value = "";
	await $fetch("/api/logout", {
		method: "POST",
		headers: {
			Authorization: "Bearer " + temp,
		},
	});
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
