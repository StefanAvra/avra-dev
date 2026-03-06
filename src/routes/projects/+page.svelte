<script lang="ts">
	import { scramble } from '$lib/actions/scramble';
</script>

<main use:scramble>
	<p class="fg-muted">~/projects</p>
	<h1>Projects</h1>
	<hr />
	<ul>
		<li>
			<a href="https://github.com/stefanavra" target="_blank" rel="noopener">[stefanavra.dev]</a>
			<p class="fg-muted">This personal site — built with SvelteKit.</p>
		</li>
	</ul>
</main>

<style>
	hr {
		border: none;
		border-top: 1px solid var(--border);
		margin: 1lh 0;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1lh;
	}

	li a {
		text-decoration: none;
		color: var(--accent);
	}

	li p {
		margin: 0;
	}
</style>
