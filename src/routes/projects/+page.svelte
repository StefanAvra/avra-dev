<script lang="ts">
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';
</script>

<main>
	<Breadcrumb path="~/projects" />
	<h1>Projects</h1>
	<hr />
	<ul>
		<li>
			<p class="fg-muted">This list is not yet populated.</p>
		</li>
		<li>
			<a href="https://avra.dev" target="_blank" rel="noopener">[avra.dev]</a>
			<p class="fg-muted">This personal site. Built with SvelteKit.</p>
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
