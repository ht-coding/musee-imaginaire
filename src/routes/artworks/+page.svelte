<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import IconMagnifyingGlassBold from 'phosphor-icons-svelte/IconMagnifyingGlassBold.svelte';
	import MiniMasonry from 'minimasonry';
	import Artwork from '$lib/components/Artwork.svelte';

	const { data } = $props();

	let refreshing = $state(data.refreshing);
	let artworks = $state(data.artworks);
	let error = $state<string | null>(null);

	$effect(() => {
		if (refreshing) {
			(async () => {
				try {
					const response = await fetch('/api/refresh');
					if (!response.ok) {
						const errorJson = await response.json();
						throw new Error(errorJson.error || 'Refresh failed');
					}
					const artResponse = await fetch('/api/artworks');
					if (!artResponse.ok) {
						throw new Error('Failed to fetch updated artworks');
					}
					const updated = await artResponse.json();
					artworks = updated;
				} catch (err: any) {
					error = err.message || 'Unknown error';
				} finally {
					refreshing = false;
				}
			})();
		}
	});

	const elementAttach = (container: HTMLElement) => {
		const masonry = new MiniMasonry({
			container
		});
	};
</script>

<form class="flex w-full items-center justify-center space-x-2">
	<!--TODO: implement fuzzy search for artworks -->
	<Input type="text" placeholder="Search" class=" max-w-sm" />
	<Button type="submit">
		<IconMagnifyingGlassBold />
	</Button>
</form>
{#if refreshing}
	<p>Database is refreshing, please wait...</p>
{:else if artworks.length === 0}
	<p>No artworks available.</p>
{:else}
	<div class="relative mt-5 px-5" {@attach elementAttach}>
		{#each artworks.slice(0, 24) as art}
			<!--TODO: Pagination -->
			<Artwork {art} thumbnail={true} />
		{/each}
	</div>
{/if}
