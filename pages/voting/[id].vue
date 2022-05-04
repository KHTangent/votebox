<template>
	<div v-if="data">
		<h1>{{ data.title }}</h1>
		<VBButton @click="refresh()"> Refresh </VBButton>
		<table>
			<tr>
				<th>Option</th>
				<th>Votes</th>
			</tr>
			<tr v-for="o in data.options">
				<td>{{ o.name }}</td>
				<td>{{ o.votes }}</td>
			</tr>
		</table>
		<VBButton @click="getBallotUrl">Issue token</VBButton>
		<p>
			{{ ballot }}
		</p>
		<VBButton v-if="ballot.length > 0" @click="copyBallot">{{
			copyButtonText
		}}</VBButton>
	</div>
	<div v-else>
		<p>Loading...</p>
	</div>
</template>

<script setup lang="ts">
const route = useRoute();
const token = useLocalLogin();
let ballot = ref("");
let copyButtonText = ref("Copy");

const { data, pending, refresh, error } = await useFetch(
	`/api/voting/${route.params.id}`,
	{
		method: "GET",
		headers: {
			Authorization: "Bearer " + token.value,
		},
		server: false,
	}
);
if (data.value) {
	data.value.options.sort((a, b) => b.votes - a.votes);
}

async function getBallotUrl() {
	copyButtonText.value = "Copy";
	const newData = (await $fetch(`/api/issue/${route.params.id}`, {
		method: "POST",
		headers: {
			Authorization: "Bearer " + token.value,
		},
	})) as { token: string };
	let url = window.location.href;
	url = url.substring(0, url.lastIndexOf("/voting"));
	ballot.value = `${url}/vote/${data.value.id}/${newData.token}`;
}

async function copyBallot() {
	await navigator.clipboard.writeText(ballot.value);
	copyButtonText.value = "Copied!";
}
</script>

<style scoped></style>
