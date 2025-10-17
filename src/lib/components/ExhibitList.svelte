<script lang="ts">
	const { data } = $props();
</script>

{#if data.exhibits.length === 0}
	<p>
		No exhibits! {#if data.user}
			<a href="/exhibits/new" class="underline">Create one?</a>
		{/if}
	</p>
{:else}
	{#each data.exhibits as exhibit}
		<a href={`/exhibits/${exhibit.id}`} class="underline">{exhibit.name}</a>
	{/each}
	{#if data.user}
		<a href="/exhibits/new" class="mt-3 underline">Create one?</a>
	{/if}
{/if}
