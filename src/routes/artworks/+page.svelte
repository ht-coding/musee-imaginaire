<script lang="ts">
	import Gallery from '$lib/components/Gallery.svelte';
	import { Button } from '$lib/components/ui/button';
	import Input from '$lib/components/ui/input/input.svelte';
	import IconMagnifyingGlassBold from 'phosphor-icons-svelte/IconMagnifyingGlassBold.svelte';
	import { goto } from '$app/navigation';
	const { data } = $props();

	let refreshing = $state(data.refreshing);
	let currentPage = $state(data.page || 1);
	let pageSize = 24;
	let pagesTotal = Math.ceil(data.artworks.length / pageSize);
	let artworks = $state(data.artworks);
	let currentArtworks = $derived(
		data.artworks.slice((currentPage - 1) * pageSize, currentPage * pageSize)
	);
	let error = $state<string | null>(null);

	$effect(() => {
		const url = new URL(window.location.href);
		url.searchParams.set('page', currentPage.toString());

		goto(url.pathname + url.search, { replaceState: true, noScroll: true });
	});
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
</script>

<form class="flex w-full items-center justify-center space-x-2">
	<!--TODO: implement fuzzy search for artworks -->
	<Input type="text" placeholder="Search" class=" max-w-sm" />
	<Button type="submit">
		<IconMagnifyingGlassBold />
	</Button>
</form>
<div>
	<Button
		disabled={currentPage === 1}
		onclick={() => {
			currentPage--;
		}}>‹</Button
	>
	{#each Array(pagesTotal) as _, i}
		<Button
			disabled={currentPage === i + 1}
			onclick={() => {
				currentPage = i + 1;
			}}>{i + 1}</Button
		>
	{/each}
	<Button
		disabled={currentPage === pagesTotal}
		onclick={() => {
			currentPage++;
		}}>›</Button
	>
</div>

{#if refreshing}
	<p>Database is refreshing, please wait...</p>
{:else if artworks.length === 0}
	<p>No artworks available.</p>
{:else}
	<Gallery artworks={currentArtworks} />
{/if}
