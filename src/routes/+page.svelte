<script lang="ts">
	import { browser } from '$app/environment';
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import IconMagnifyingGlassBold from 'phosphor-icons-svelte/IconMagnifyingGlassBold.svelte';
	import { onMount } from 'svelte';

	let artworksPromise: Promise<any>;
	onMount(() => {
		if (browser) {
			artworksPromise = fetch('/api/artworks').then((response) => response.json());
		}
	});
</script>

<h1 class="py-5 text-center text-2xl">Your Musée Imaginaire</h1>

<form class="flex w-full items-center justify-center space-x-2">
	<!--TODO: implement fuzzy search for artworks -->
	<Input type="text" placeholder="Search" class=" max-w-sm" />
	<Button type="submit">
		<IconMagnifyingGlassBold />
	</Button>
</form>
{#if artworksPromise}
	{#await artworksPromise}
		<p>Loading...</p>
	{:then artworks}
		<div class="mt-5 columns-6 gap-8 px-5">
			{#each artworks.slice(0, 24) as art}
				<!--TODO: Pagination, figcaption styling and content, image loading placeholders -->
				<a href="/artwork/{art.collectionId}-{art.artworkId}" class="transition hover:opacity-90">
					<figure class="mb-5 break-inside-avoid aspect-[{art.width}/{art.height}]">
						<img
							src={art.thumbnailURL}
							alt=""
							class="h-full w-full shadow-sm/50"
							style="aspect-ratio:{art.width}/{art.height};background:#eee;border-color: #75553e;border-style: inset inset outset outset;border-width: 0.75em;"
						/>
						<figcaption class="mt-auto">{art.title}</figcaption>
					</figure>
				</a>
			{/each}
		</div>
	{:catch error}
		<p>Error loading artworks: {error.message}</p>
	{/await}
{/if}
