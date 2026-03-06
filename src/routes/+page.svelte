<script lang="ts">
	import EmailTooltip from '$lib/components/EmailTooltip.svelte';
	import { scramble } from '$lib/actions/scramble';
</script>

<main use:scramble>
	<p class="fg-muted">~</p>
	<h1>Stefan Avramescu</h1>
	<p>
		Hi. I'm a full stack engineer from Germany.
		<br />
		Welcome to my personal site. A place to experiment, share notes and projects.
	</p>

	<div class="links">
		<EmailTooltip />
		<a href="https://github.com/stefanavra" target="_blank" rel="noopener">[github]</a>
		<a href="https://www.codewars.com/users/avra" target="_blank" rel="noopener noreferrer"
			>[codewars]</a
		>
	</div>
</main>
