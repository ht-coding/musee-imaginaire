<script lang="ts">
	import Gallery from '$lib/components/Gallery.svelte';
	import { Button } from '$lib/components/ui/button';
	import * as Select from '$lib/components/ui/select/index.js';
	import { goto } from '$app/navigation';
	import Fuse from 'fuse.js';
	import Searchbar from '$lib/components/Searchbar.svelte';
	import IconSortAscendingBold from 'phosphor-icons-svelte/IconSortAscendingBold.svelte';
	import IconSortDescendingBold from 'phosphor-icons-svelte/IconSortDescendingBold.svelte';

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
	let buttonCount = 5;
	let visiblePages = $derived.by(() => {
		if (pagesTotal <= buttonCount) return Array.from({ length: pagesTotal }, (_, i) => i + 1);

		let start = Math.max(1, currentPage - Math.floor(buttonCount / 2));
		let end = start + buttonCount - 1;
		if (end > pagesTotal) {
			end = pagesTotal;
			start = end - buttonCount + 1;
		}
		return Array.from({ length: end - start + 1 }, (_, i) => start + i);
	});
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

	let value = $state('Collection');
	let ascending = $state(true);
	const sortingCriteria = ['Title', 'Artist', 'Medium', 'Accession Year', 'Collection'];
	const triggerContent = $derived(sortingCriteria.find((option) => option === value));
</script>

<form
	class="my-5 flex w-full items-center justify-center space-x-2"
	onsubmit={(event) => {
		event.preventDefault();
		searchQuery = inputValue;
	}}
>
	<Searchbar bind:inputValue />
</form>
{@render pagination()}
<!-- TODO: implement sorting-->
<div class="mt-3 !hidden flex items-center justify-center gap-2">
	Sort by: <Select.Root type="single" name="exhibitToAddTo" bind:value>
		<Select.Trigger class="w-[180px] bg-white">
			{triggerContent}
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Your Exhibits</Select.Label>
				{#each sortingCriteria as critereon, i (i)}
					<Select.Item value={critereon} label={critereon}>
						{critereon}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
	<Button>
		{#if ascending}
			<IconSortAscendingBold />
		{:else}
			<IconSortDescendingBold />
		{/if}
	</Button>
</div>

{#if refreshing}
	<p>Database is refreshing, please wait...</p>
{:else if artworks.length === 0}
	<p>No artworks available.</p>
{:else}
	<Gallery artworks={currentArtworks} />
{/if}

{@render pagination()}

{#snippet pagination()}
	<div class="flex justify-center gap-1">
		<Button
			disabled={currentPage === 1}
			onclick={() => {
				currentPage--;
			}}>‹</Button
		>
		{#each visiblePages as page}
			<Button
				disabled={currentPage === page}
				onclick={() => {
					currentPage = page;
				}}>{page}</Button
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
