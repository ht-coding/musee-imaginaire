<script lang="ts">
	import '../app.css';
	import favicon from '$lib/assets/favicon.svg';
	import { page } from '$app/state';

	let { children, data } = $props();
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

{#if page.url.pathname !== '/account/login'}
	<nav>
		{#if data.user}
			<p>Hi <a href="/account">{data.user.username}</a>!</p>
		{:else}
			<a href="/account/login">Login</a>
		{/if}
	</nav>
{/if}
{@render children?.()}
