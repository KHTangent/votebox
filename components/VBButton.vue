<template>
	<button class="button" :style="style">
		<slot></slot>
	</button>
</template>

<script lang="ts" setup>
import { StyleValue } from 'vue';

const props = defineProps({
	look: {
		type: String,
		default: "primary"
	}
});

const style = computed(():StyleValue => {
	return {
		backgroundColor: "var(--primary)",
		borderColor: "var(--primary-800)",
		color: "var(--primary-text-800)"
	}
});
</script>

<style scoped>
.button {
	padding: 0.4em;
	border-radius: 0.2em;
}
</style>
