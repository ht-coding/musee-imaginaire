<script lang="ts">
	import { Input } from '$lib/components/ui/input';
	import * as Field from '$lib/components/ui/field/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Textarea } from '$lib/components/ui/textarea';
	import { enhance } from '$app/forms';
	import type { ActionData } from '../$types';
	let { form }: { form: ActionData } = $props();
</script>

<form method="post" class="mt-5 rounded-2xl bg-white p-5" use:enhance>
	<h2 class="mb-3 text-center text-2xl">Create a new Exhibit</h2>
	<Field.Field>
		<Field.Label for="name">Exhibit Name</Field.Label>
		<Input type="text" placeholder="Title" name="name"></Input>
	</Field.Field>
	<Field.Field>
		<Field.Label for="name">Exhibit Description</Field.Label>
		<Textarea placeholder="Enter text here..." name="description" />
	</Field.Field>
	<p style="color: red">{form?.message ?? ''}</p>

	<Button type="submit">Create new exhibit</Button>
</form>
