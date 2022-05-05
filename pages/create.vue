<template>
	<div>
		<form class="form" @submit.prevent="createVoting">
			<div class="formline">
				<label for="txt-title">Vote title: </label>
				<input
					id="txt-title"
					class="textfield"
					type="text"
					v-model="voteTitle"
					placeholder="Voting title"
				/>
			</div>
			<div class="formline">
				Options count: <strong>{{ options.length }}</strong>
				<VBButton class="number-button" @click="decreaseOptions">-</VBButton>
				<VBButton class="number-button" @click="increaseOptions">+</VBButton>
			</div>
			<div v-for="(s, i) in options" class="formline">
				<label :for="'txt-option-' + i">Vote option {{ i + 1 }}: </label>
				<input
					:id="'txt-option-' + i"
					class="textfield"
					type="text"
					v-model="options[i]"
					:placeholder="'Option ' + (i + 1)"
				/>
			</div>
			<div class="formline">
				<VBButton type="submit"> Create </VBButton>
			</div>
			<div class="formline">
				<div v-if="errorMessage.length != 0" class="error">
					{{ errorMessage }}
				</div>
			</div>
		</form>
	</div>
</template>

<script setup lang="ts">
let localToken = useLocalLogin();
let voteTitle = ref("");
let errorMessage = ref("");
let options = ref(["", "", ""]);

function validateInput(): boolean {
	if (voteTitle.value.length === 0) {
		errorMessage.value = "Title cannot be empty";
		return false;
	}
	for (const option of options.value) {
		if (option.length === 0) {
			errorMessage.value = "One or more options are empty";
			return false;
		}
	}
	if (new Set(options.value).size !== options.value.length) {
		errorMessage.value = "Options cannot contain duplicates";
		return false;
	}
	return true;
}

async function createVoting() {
	if (!validateInput()) return;
	const payload = {
		title: voteTitle.value,
		options: options.value,
	};
	const newVote = await $fetch("/api/voting", {
		method: "POST",
		headers: {
			Authorization: "Bearer " + localToken.value,
		},
		body: payload,
	});
	navigateTo(`/voting/${newVote.id}`);
}

function decreaseOptions() {
	if (options.value.length <= 2) return;
	options.value.pop();
}

function increaseOptions() {
	options.value.push("");
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

.error {
	background-color: var(--error);
	padding: 1em;
}

.number-button {
	margin: 0.2em;
}
</style>
