<script lang="ts">
	const { art, thumbnail = false } = $props();
	let imgEl: HTMLImageElement;
	let containerEl: HTMLDivElement;
	function handleLoad() {
		containerEl.classList.remove('loading');
	}
	$effect(() => {
		if (imgEl?.complete) {
			handleLoad();
		}
	});
</script>

{#snippet image(art)}
	<div class="img-container loading h-full w-full shadow-sm/50" bind:this={containerEl}>
		<img
			src={thumbnail || art.collection === 'Met'
				? art.thumbnailURL
				: art.imageURL + '?height=900&width=1200'}
			alt={art.alt}
			class="h-full w-full"
			onload={handleLoad}
			bind:this={imgEl}
		/>
	</div>
{/snippet}
<figure
	class="visible {thumbnail ? 'absolute' : ''} break-inside-avoid opacity-100 transition-all"
	style="--width:{art.width};--height:{art.height};"
>
	{#if thumbnail}
		<a href="/artworks/{art.collectionId}-{art.artworkId}" class="transition hover:opacity-90">
			{@render image(art)}
		</a>
	{:else}
		{@render image(art)}
	{/if}
</figure>

<style>
	@keyframes spin {
		100% {
			transform: rotate(1turn);
		}
	}
	.img-container {
		aspect-ratio: var(--width) / var(--height);
		background: #eee;
		border-color: #75553e;
		border-style: inset inset outset outset;
		border-width: 0.75em;
	}
	.loading {
		position: relative;
		display: flex;
		align-items: center;
		justify-content: center;
		flex-direction: column;
		&.img-container {
			&::after {
				content: '';
				background-image: url('/assets/circle-notch.svg');
				background-size: contain;
				background-repeat: no-repeat;
				width: 3rem;
				height: 3rem;
				display: block;
				position: absolute;
				animation: spin 1s linear infinite;
			}
		}
	}
</style>
