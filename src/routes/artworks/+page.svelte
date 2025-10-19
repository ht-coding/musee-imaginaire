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

	let category = $state(data.category || 'Title');
	let ascending = $state(data.order || false);
	const searchCriteria = ['Title', 'Artist', 'Medium', 'Accession Year', 'Description'];
	let triggerContent = $derived(searchCriteria.find((option) => option === category));
	let searchCategory = $derived.by(() => {
		switch (triggerContent) {
			case 'Title':
				return ['title'];

			case 'Artist':
				return [
					['artists', 'name'],
					['artists', 'culture'],
					['artists', 'years'],
					['artists', 'gender']
				];

			case 'Medium':
				return ['medium'];

			case 'Accession Year':
				return ['accessionYear'];

			case 'Description':
				return ['description', 'alt'];

			default:
				return [
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
				];
		}
	});
	let fuse: Fuse<any> = $state(
		new Fuse(data.artworks, {
			keys: ['title'],
			threshold: 0.3
		})
	);

	$effect(() => {
		function customSortFn(a, b) {
			const originalA = data.artworks[a.idx];
			const originalB = data.artworks[b.idx];

			const titleA = (originalA.title || '').toLowerCase();
			const titleB = (originalB.title || '').toLowerCase();

			const cmp = titleA.localeCompare(titleB);
			return cmp;
		}
		fuse = new Fuse(data.artworks, {
			keys: searchCategory,
			sortFn: customSortFn,
			threshold: 0.3
		});
	});

	let searchQuery = $state(data.query);
	let inputValue = $state(data.query);

	let artworks = $derived(
		searchQuery ? fuse.search(searchQuery).map((result) => result.item) : data.artworks
	);
	let artworksSorted = $derived(ascending ? artworks.toReversed() : artworks);

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
		artworksSorted.slice((currentPage - 1) * pageSize, currentPage * pageSize)
	);

	$effect(() => {
		const url = new URL(window.location.href);
		const setParam = (key: string, value?: string | null, condition: boolean = true) => {
			if (condition && value) {
				url.searchParams.set(key, value);
			} else {
				url.searchParams.delete(key);
			}
		};

		setParam('page', currentPage.toString(), currentPage !== 1);
		setParam('q', searchQuery, !!searchQuery);
		setParam('order', 'asc', ascending as boolean);
		setParam('category', category, category !== 'Title');

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
	function scrollToTop() {
		window.scrollTo(0, 0);
	}
</script>

<div class="mt-3 flex items-center justify-center gap-2">
	Search by: <Select.Root type="single" name="exhibitToAddTo" bind:value={category}>
		<Select.Trigger class="w-[180px] bg-white">
			{triggerContent}
		</Select.Trigger>
		<Select.Content>
			<Select.Group>
				<Select.Label>Search Criteria</Select.Label>
				{#each searchCriteria as critereon, i (i)}
					<Select.Item value={critereon} label={critereon}>
						{critereon}
					</Select.Item>
				{/each}
			</Select.Group>
		</Select.Content>
	</Select.Root>
	<Button
		onclick={() => {
			ascending = !ascending;
			currentPage = 1;
		}}
	>
		{#if ascending}
			<IconSortAscendingBold /> Ascending
		{:else}
			<IconSortDescendingBold /> Descending
		{/if}
	</Button>
</div>
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
				scrollToTop();
			}}>‹</Button
		>
		{#each visiblePages as page}
			<Button
				disabled={currentPage === page}
				onclick={() => {
					currentPage = page;
					scrollToTop();
				}}>{page}</Button
			>
		{/each}
		<Button
			disabled={currentPage === pagesTotal}
			onclick={() => {
				currentPage++;
				scrollToTop();
			}}>›</Button
		>
	</div>
{/snippet}
