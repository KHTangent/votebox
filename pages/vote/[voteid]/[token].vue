<template>
	<div v-if="!pending && voting" class="container">
		<h1>{{ voting.title }}</h1>
		<div class="options">
			<div
				v-for="(s, i) in voting.options"
				class="option"
				:class="{ selected: selected === i }"
				@click="changeSelection(i)"
			>
				<h2>{{ s }}</h2>
			</div>
		</div>
		<VBButton :disabled="voted || selected === -1" @click="submitVote"
			>Submit</VBButton
		>
		<p v-if="!voted">
			Selected: <strong>{{ voting.options[selected] }}</strong>
		</p>
		<p v-else>Vote has been submitted!</p>
	</div>
	<p v-else>
		Could not get voting options. Your voting token is probably invalid, or has
		been used before. Please contact the owner of the voting if you believe this
		is an error.
	</p>
</template>

<script setup lang="ts">
let selected = ref(-1);
let voted = ref(false);

const route = useRoute();
const voteId = route.params.voteid as string;
const token = route.params.token as string;
const { data, pending } = await useFetch(`/api/options/${voteId}/${token}`, {
	method: "GET",
});
const voting = data.value as {
	title: string;
	options: string[];
};

function changeSelection(i: number) {
	selected.value = i;
}

async function submitVote() {
	await $fetch(`/api/vote/${voteId}/${token}`, {
		method: "POST",
		body: {
			name: voting.options[selected.value],
		},
	});
	voted.value = true;
}
</script>

<style scoped>
.options {
	display: flex;
	align-items: stretch;
	flex-direction: column;
	margin: 1em;
}

.option {
	border: 1px solid var(--primary-800);
	margin: 0.2em;
	padding: 0.8em;
	cursor: pointer;
}

.selected {
	background-color: var(--primary-700);
}

.container {
	display: flex;
	flex-direction: column;
	align-items: center;
}
</style>
