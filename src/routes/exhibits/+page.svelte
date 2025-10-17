<script lang="ts">
	import { browser } from '$app/environment';

	let exhibitsPromise: Promise<any>;
	if (browser) exhibitsPromise = fetch('/api/exhibits/').then((response) => response.json());
</script>

{#if exhibitsPromise}
	{#await exhibitsPromise}
		<p>Loading...</p>
	{:then exhibits}
		{#if exhibits.length === 0}
			<p>No exhibits! <a href="/exhibits/new" class="underline">Create one?</a></p>
		{:else}
			{#each exhibits as exhibit}
				{exhibit.name}
			{/each}
			<a href="/exhibits/new" class="underline">Create one?</a>
		{/if}
	{:catch error}
		<p>Error loading exhibits: {error.message}</p>
	{/await}
{/if}
