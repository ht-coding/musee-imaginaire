<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
	import Artwork from '$lib/components/Artwork.svelte';
	import { onMount } from 'svelte';

	let artworkPromise: Promise<any>;
	onMount(() => {
		if (browser) {
			artworkPromise = fetch('/api/artworks/' + page.params.id).then((response) => response.json());
		}
	});
</script>

{#if artworkPromise}
	{#await artworkPromise}
		<p>Loading...</p>
	{:then artwork}
		<div class="mx-auto max-w-3xl">
			<Artwork art={artwork} />
			<p class="text-sm text-gray-500">{artwork.creditLine}</p>
		</div>
		<h1 class="text-2xl">
			{artwork.title} :: {#each artwork.artists as artist, i}
				{#if i !== 0}&
				{/if}{artist.name}
			{/each}
		</h1>
		<p>{artwork.description}</p>
		<p>
			<a href={artwork.artworkURL} class="text-blue-600 hover:underline"
				>Click here to view on the {artwork.collection} website.</a
			>
			:: <a href="/" class="text-blue-600 hover:underline">Return to homepage</a>
		</p>
	{:catch error}
		<p>Error loading artworks: {error.message}</p>
	{/await}
{/if}
