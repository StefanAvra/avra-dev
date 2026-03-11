<script lang="ts">
	import type { Component } from 'svelte';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let { data } = $props();
	let Content = $derived(data.content as unknown as Component);
</script>

<main>
	<Breadcrumb path={`~/notes/${data.slug}`} />
	<h1>{data.title}</h1>
	<p class="fg-muted">{data.date}</p>
	<hr />
	<div class="prose">
		<Content />
	</div>
</main>

<style>
	hr {
		border: none;
		border-top: 1px solid var(--border);
		margin: 1lh 0;
	}

	.prose :global(p) {
		margin: 0 0 1lh 0;
	}

	.prose :global(h2) {
		margin: 2lh 0 1lh 0;
		font-weight: 700;
	}

	.prose :global(pre) {
		border: 1px solid var(--border);
		padding: 1lh 2ch;
		background: var(--bg-subtle);
		overflow-x: auto;
	}

	.prose :global(blockquote) {
		border-left: 2px solid var(--border);
		margin: 0 0 1lh 0;
		padding-left: 2ch;
		color: var(--fg-muted);
	}

	.prose :global(ul),
	.prose :global(ol) {
		margin: 0 0 1lh 0;
		padding-left: 4ch;
	}
</style>
