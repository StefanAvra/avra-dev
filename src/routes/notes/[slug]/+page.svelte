<script lang="ts">
	import type { Component } from 'svelte';
	import { onMount } from 'svelte';
	let { data } = $props();
	let Content = $derived(data.content as unknown as Component);

	onMount(() => {
		if (data.atproto_uri) {
			const link = document.createElement('link');
			link.rel = 'site.standard.document';
			link.href = data.atproto_uri;
			document.head.appendChild(link);
		}
	});
</script>

<h1 class="">{data.title}</h1>
<p class="m-0 mb-[1lh] text-sm text-muted">{data.date.slice(0, 10)}</p>
<hr class="my-[1lh] border-0 border-t border-dashed border-border" />
<div class="prose">
	<Content />
</div>

<style>
	.prose :global(p) {
		margin: 0 0 1lh 0;
	}

	/* LINKS — bracketed like the nav, accent color, external arrow */
	.prose :global(a) {
		color: var(--color-accent);
		text-decoration: none;
	}
	.prose :global(a)::before {
		content: '[';
		color: var(--color-muted);
	}
	.prose :global(a)::after {
		content: ']';
		color: var(--color-muted);
	}
	.prose :global(a:hover) {
		text-decoration: underline;
	}
	.prose :global(a:hover)::before,
	.prose :global(a:hover)::after {
		color: var(--color-accent);
	}
	.prose :global(a[href^='http'])::after {
		content: ' ↗]';
	}

	/* HEADINGS — markdown source-marker sigils */
	.prose :global(h2) {
		margin: 2lh 0 1lh 0;
		font-weight: 700;
		color: var(--color-orange);
	}
	.prose :global(h3) {
		margin: 1lh 0 0.5lh 0;
		font-weight: 700;
		color: var(--color-yellow);
	}
	.prose :global(h2)::before {
		content: '## ';
		color: var(--color-muted);
	}
	.prose :global(h3)::before {
		content: '### ';
		color: var(--color-muted);
	}

	/* EMPHASIS */
	.prose :global(strong) {
		font-weight: 700;
		color: var(--color-fg);
	}
	.prose :global(em) {
		font-style: italic;
		color: var(--color-yellow);
	}

	/* INLINE CODE — pink chip (wins over the global grey rule inside prose) */
	.prose :global(code:not(pre code)) {
		color: var(--color-pink);
		background: var(--color-subtle);
		border: 1px solid var(--color-border);
		padding: 0 0.4ch;
		border-radius: 2px;
	}

	/* CODE BLOCK — box with green stripe; nested code resets the chip */
	.prose :global(pre) {
		border: 1px solid var(--color-border);
		border-left: 2px solid var(--color-green);
		padding: 1lh 2ch;
		background: var(--color-subtle);
		overflow-x: auto;
	}
	.prose :global(pre code) {
		color: var(--color-fg);
		background: none;
		border: none;
		padding: 0;
	}

	/* SYNTAX HIGHLIGHTING — color PrismJS token classes with the palette */
	.prose :global(.token.comment),
	.prose :global(.token.prolog) {
		color: var(--color-muted);
		font-style: italic;
	}
	.prose :global(.token.keyword),
	.prose :global(.token.tag),
	.prose :global(.token.selector) {
		color: var(--color-red);
	}
	.prose :global(.token.string),
	.prose :global(.token.attr-value),
	.prose :global(.token.char) {
		color: var(--color-green);
	}
	.prose :global(.token.function),
	.prose :global(.token.class-name) {
		color: var(--color-blue);
	}
	.prose :global(.token.number),
	.prose :global(.token.boolean),
	.prose :global(.token.constant) {
		color: var(--color-orange);
	}
	.prose :global(.token.property),
	.prose :global(.token.attr-name) {
		color: var(--color-yellow);
	}
	.prose :global(.token.operator),
	.prose :global(.token.punctuation) {
		color: var(--color-muted);
	}
	.prose :global(.token.regex),
	.prose :global(.token.important) {
		color: var(--color-pink);
	}

	/* BLOCKQUOTE — green rule + sigil */
	.prose :global(blockquote) {
		border-left: 2px solid var(--color-green);
		margin: 0 0 1lh 0;
		padding-left: 2ch;
		color: var(--color-muted);
	}
	.prose :global(blockquote) :global(p)::before {
		content: '> ';
		color: var(--color-green);
	}

	/* LISTS — green markers */
	.prose :global(ul),
	.prose :global(ol) {
		margin: 0 0 1lh 0;
		padding-left: 4ch;
	}
	.prose :global(li)::marker {
		color: var(--color-green);
	}
	.prose :global(ul) {
		list-style: none;
	}
	.prose :global(ul) :global(li)::before {
		content: '- ';
		color: var(--color-green);
	}

	/* TABLES — terminal grid, orange header */
	.prose :global(table) {
		border-collapse: collapse;
		width: 100%;
		margin: 0 0 1lh 0;
	}
	.prose :global(th),
	.prose :global(td) {
		border: 1px solid var(--color-border);
		padding: 0.25lh 1ch;
		text-align: left;
	}
	.prose :global(th) {
		color: var(--color-orange);
		text-transform: uppercase;
		font-weight: 700;
	}

	/* HR — dashed terminal rule */
	.prose :global(hr) {
		border: none;
		border-top: 1px dashed var(--color-border);
		margin: 2lh 0;
	}
</style>
