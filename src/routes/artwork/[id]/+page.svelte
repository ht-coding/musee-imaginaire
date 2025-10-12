<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/state';
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
		<figure>
			<img
				src={artwork.collectionId === 'Harvard'
					? artwork.imageURL + '?height=900&width=1200'
					: artwork.thumbnailURL}
				alt={artwork.alt}
			/>
			<figcaption class="text-sm text-gray-500">{artwork.creditLine}</figcaption>
		</figure>
		<h1 class="text-2xl">
			{artwork.title} :: {artwork.artists[0].artist.name}
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
