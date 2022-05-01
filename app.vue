<template>
	<div id="container">
		<nav id="header">
			<TheHeader />
		</nav>
		<div id="content">
			<div id="inner-content">
				<NuxtPage />
			</div>
		</div>
		<footer id="footer">
			<TheFooter />
		</footer>
	</div>
</template>
<style scoped>
	#container {
		min-height: 100vh;
		display: flex;
		flex-direction: column;
	}
	
	#content {
		flex-grow: 1;
		padding: 1em;
	}

	#inner-content {
		max-width: 1280px;
		margin: auto;
	}
</style>
