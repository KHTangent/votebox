<template>
	<div v-if="!pending">
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
	</div>
	<div v-else>
		<p>Loading...</p>
	</div>
</template>

<script setup lang="ts">
const route = useRoute();
const token = useLocalLogin();
const { data, pending, refresh, error } = await useFetch(
	`/api/voting/${route.params.id}`,
	{
		method: "GET",
		headers: {
			Authorization: "Bearer " + token.value,
		},
	}
);
</script>

<style scoped></style>
