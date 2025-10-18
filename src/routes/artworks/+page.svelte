<script lang="ts">
	import Gallery from '$lib/components/Gallery.svelte';
	import { Button } from '$lib/components/ui/button';
	import { goto } from '$app/navigation';
	import Fuse from 'fuse.js';
	import Searchbar from '$lib/components/Searchbar.svelte';

	const { data } = $props();

	let refreshing = $state(data.refreshing);
	let error = $state<string | null>(null);
	const fuse = new Fuse(data.artworks, {
		keys: [
			'collection',
			'title',
			'medium',
			'description',
			'alt',
			'department',
			['artists', 'name'],
			['artists', 'culture'],
			['artists', 'years'],
			['artists', 'gender']
		],
		getFn: customGetFn,
		threshold: 0.3
	});

	function customGetFn(object: any, path: string | string[]) {
		if (typeof path === 'string') return object[path];
		const flattenedValue = path.reduce((value: any, key: string) => {
			if (Array.isArray(value)) {
				return value.flatMap((item) => item[key] || []);
			}
			return value?.[key];
		}, object);
		return flattenedValue;
	}

	let searchQuery = $state(data.query);
	let inputValue = $state(data.query);

	let artworks = $derived(
		searchQuery ? fuse.search(searchQuery).map((result) => result.item) : data.artworks
	);

	let currentPage = $state(data.page || 1);
	let pageSize = 24;
	let pagesTotal = $derived(Math.ceil(artworks.length / pageSize));
	let currentArtworks = $derived(
		artworks.slice((currentPage - 1) * pageSize, currentPage * pageSize)
	);

	$effect(() => {
		const url = new URL(window.location.href);
		url.searchParams.set('page', currentPage.toString());
		if (currentPage === 1) url.searchParams.delete('page');
		url.searchParams.set('q', searchQuery ?? '');
		if (!searchQuery) url.searchParams.delete('q');

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

<form
	class="mt-5 flex w-full items-center justify-center space-x-2"
	onsubmit={(event) => {
		event.preventDefault();
		searchQuery = inputValue;
	}}
>
	<Searchbar bind:inputValue />
</form>

{@render pagination()}

{#if refreshing}
	<p>Database is refreshing, please wait...</p>
{:else if artworks.length === 0}
	<p>No artworks available.</p>
{:else}
	<Gallery artworks={currentArtworks} />
{/if}

{@render pagination()}

{#snippet pagination()}
	<div class="mt-5 flex justify-center gap-1">
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
{/snippet}
