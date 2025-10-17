<script lang="ts">
	import Artwork from '$lib/components/Artwork.svelte';
	const { data } = $props();
</script>

<div class="mx-auto w-3xl">
	<Artwork art={data.artwork} />
	<p class="text-sm text-gray-500">{data.artwork.creditLine}</p>
</div>
<h1 class="text-2xl">
	{data.artwork.title} :: {#each data.artwork.artists as artist, i}
		{#if i !== 0}&
		{/if}{artist.name}
	{/each}
</h1>
<p>{data.artwork.description}</p>
<p>
	<a href={data.artwork.artworkURL} class="text-blue-600 hover:underline"
		>Click here to view on the {data.artwork.collection} website.</a
	>
	:: <a href="/" class="text-blue-600 hover:underline">Return to homepage</a>
</p>
