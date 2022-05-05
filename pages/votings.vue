<template>
	<div>
		<table>
			<tr>
				<th>Voting title</th>
				<th>Voting ID</th>
				<th>Get voting URL</th>
			</tr>
			<tr v-for="e in data">
				<td>
					<NuxtLink :to="'/voting/' + e.id">
						{{ e.title }}
					</NuxtLink>
				</td>
				<td>
					<NuxtLink :to="'/voting/' + e.id">
						{{ e.id }}
					</NuxtLink>
				</td>
				<td>
					<VBButton @click="getBallotUrl(e.id)"> Copy ballot </VBButton>
				</td>
			</tr>
		</table>
	</div>
</template>

<script setup lang="ts">
const token = useLocalLogin();
const { data, pending, refresh, error } = await useFetch("/api/votings", {
	method: "GET",
	headers: {
		Authorization: "Bearer " + token.value,
	},
	server: false,
});

async function getBallotUrl(id: string) {
	const newData = (await $fetch(`/api/issue/${id}`, {
		method: "POST",
		headers: {
			Authorization: "Bearer " + token.value,
		},
	})) as { token: string };
	let url = window.location.href;
	url = url.substring(0, url.lastIndexOf("/votings"));
	const fullUrl = `${url}/vote/${id}/${newData.token}`;
	await navigator.clipboard.writeText(fullUrl);
}
</script>

<style scoped></style>
