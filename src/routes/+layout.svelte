<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';

	let { children } = $props();
</script>

<svelte:head>
	<link rel="icon" href={favicon} />
	<style>
		body {
			background-image: url('/assets/45degreee_fabric.png'); /* Background image from Toptal Subtle Textures */
			background-attachment: fixed;
		}
	</style>
</svelte:head>

{@render children?.()}
