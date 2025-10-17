<script lang="ts">
	import MiniMasonry from 'minimasonry';
	import Artwork from '$lib/components/Artwork.svelte';

	const { artworks } = $props();
	let container: HTMLElement | null = null;
	let masonry: MiniMasonry | null = null;

	$effect(() => {
		if (!container) return;

		masonry = new MiniMasonry({ container });

		return () => {
			masonry?.destroy();
			masonry = null;
		};
	});

	$effect(() => {
		artworks;
		if (masonry) masonry.layout();
	});
</script>

<div class="relative mt-5 px-5" bind:this={container}>
	{#each artworks as art}
		<Artwork {art} thumbnail={true} />
	{/each}
</div>
