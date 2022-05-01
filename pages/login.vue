<template>
	<form class="form" @submit.prevent="login">
		<div class="formline">
			<label for="txt-username">Username: </label>
			<input id="txt-username" class="textfield" type="text" v-model="username" placeholder="Username">	
		</div>
		<div class="formline">
			<label for="txt-username">Password: </label>
			<input id="txt-password" class="textfield" type="text" v-model="password" placeholder="password">
		</div>
		<div class="formline">
			<VBButton type="submit">
				Sign in
			</VBButton>
		</div>
	</form>
</template>

<script setup lang="ts">
let username = ref("");
let password = ref("");

async function login() {
	console.log("Logged in");
	return false;
}
</script>

<style scoped>
.form {
	display: flex;
	flex-direction: column;
	align-items: stretch;
}
.formline {
	margin: 1em;
	display: flex;
	align-items: center;
	flex-direction: row;
	justify-content: center;
}
.textfield {
	padding: 0.4em;
	background: var(--primary-text);
	color: var(--primary);
}
</style>
