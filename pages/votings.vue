<template>
	<div>
		<ul>
			<li v-for="e in data">
				<NuxtLink :to="'/voting/' + e.id">
					{{ e.title }}
				</NuxtLink>
			</li>
		</ul>
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
</script>

<style scoped></style>
