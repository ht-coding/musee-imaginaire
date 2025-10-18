<script lang="ts">
	import IconMagnifyingGlassBold from 'phosphor-icons-svelte/IconMagnifyingGlassBold.svelte';
	import Button from './ui/button/button.svelte';
	import Input from './ui/input/input.svelte';

	let { inputValue = $bindable() } = $props();
</script>

<Input
	type="text"
	placeholder="Begin typing..."
	class="max-w-sm md:h-12 md:max-w-md md:!text-2xl"
	bind:value={inputValue}
/>
<Button type="submit" class="md:!m-0 md:!px-5 md:py-6 md:!text-lg">
	<IconMagnifyingGlassBold /> Search
</Button>
