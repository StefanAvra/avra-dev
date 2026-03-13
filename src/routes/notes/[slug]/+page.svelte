<script lang="ts">
	import type { Component } from 'svelte';
	let { data } = $props();
	let Content = $derived(data.content as unknown as Component);
</script>

<h1 class="">{data.title}</h1>
<p class="m-0 mb-[1lh] text-sm text-muted">{data.date.slice(0, 10)}</p>
<hr class="my-[1lh] border-t border-none border-border" />
<div class="prose">
	<Content />
</div>

<style>
	.prose :global(p) {
		margin: 0 0 1lh 0;
	}

	.prose :global(h2) {
		margin: 2lh 0 1lh 0;
		font-weight: 700;
	}

	.prose :global(pre) {
		border: 1px solid var(--color-border);
		padding: 1lh 2ch;
		background: var(--color-subtle);
		overflow-x: auto;
	}

	.prose :global(blockquote) {
		border-left: 2px solid var(--color-border);
		margin: 0 0 1lh 0;
		padding-left: 2ch;
		color: var(--color-muted);
	}

	.prose :global(ul),
	.prose :global(ol) {
		margin: 0 0 1lh 0;
		padding-left: 4ch;
	}
</style>
