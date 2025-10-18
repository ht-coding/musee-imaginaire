<script lang="ts">
	import { enhance } from '$app/forms';
	import type { ActionData } from './$types';

	import * as Field from '$lib/components/ui/field/index.js';
	import { Button } from '$lib/components/ui/button';
	import { Input } from '$lib/components/ui/input';
	import { page } from '$app/state';

	let { form }: { form: ActionData } = $props();
</script>

<form method="post" action="?/login" use:enhance>
	<Field.Set class="mx-auto mt-5 max-w-4xl rounded-2xl bg-white p-5 text-center">
		<h2>Login/Register</h2>
		<Field.Group>
			<input
				type="hidden"
				name="redirect"
				value={decodeURIComponent(page.url.searchParams.get('redirect') ?? '/')}
			/>
			<Field.Field>
				<Field.Label for="username">Username</Field.Label>
				<Input id="username" type="text" name="username" placeholder="ArtFan123" minlength={3} />
			</Field.Field>
			<Field.Field>
				<Field.Label for="password">Password</Field.Label>
				<Input id="password" name="password" type="password" placeholder="********" minlength={6} />
			</Field.Field>
			<Field.Field orientation="horizontal">
				<Button type="submit">Login</Button>
				<Button type="submit" formaction="?/register">Register</Button>
			</Field.Field>
		</Field.Group>
		<p style="color: red">{form?.message ?? ''}</p>
	</Field.Set>
</form>
