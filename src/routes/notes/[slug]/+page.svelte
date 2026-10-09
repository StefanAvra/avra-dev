<script lang="ts">
	import type { Component } from 'svelte';
	import { onMount } from 'svelte';
	import Comments from '$lib/components/Comments.svelte';
	import NoteLength from '$lib/components/NoteLength.svelte';
	import TagLinks from '$lib/components/TagLinks.svelte';
	import NoteTitle from '$lib/components/NoteTitle.svelte';
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

<div class="mb-auto">
	<h1 class="mt-header">
		<NoteTitle slug={data.slug} title={data.title} always />
	</h1>
	{#if data.description}
		<p
			class="m-0 -mt-[0.5lh] mb-[1lh] max-w-[65ch] font-serif text-lg text-balance text-fg/75 italic [font-optical-sizing:auto]"
		>
			{data.description}
		</p>
	{/if}
	<p class="m-0 mb-[1lh] flex flex-wrap gap-[1ch] text-sm text-muted">
		<time datetime={data.date}>{data.date.slice(0, 10)}</time>
		<span aria-hidden="true">·</span>
		<NoteLength stats={data.stats} />
		{#if data.tags.length}
			<span aria-hidden="true">·</span>
			<TagLinks tags={data.tags} />
		{/if}
	</p>
	<hr class="my-[1lh] border-0 border-t border-dashed border-border" />
	<div class="prose">
		<Content />
	</div>

	{#if data.bsky_thread_uri}
		<hr class="my-[1lh] border-0 border-t border-dashed border-border" />
		<Comments uri={data.bsky_thread_uri} />
	{/if}
</div>

<style>
	/* Longform reading: serif body; headings, code and UI stay mono. */
	.prose {
		max-width: 65ch;
		font-family: var(--font-serif);
		font-size: clamp(1.0625rem, 1rem + 0.4vw, 1.1875rem);
		font-optical-sizing: auto;
		line-height: 1.7;
		color: var(--color-fg);
		text-wrap: pretty;
		hanging-punctuation: first;
	}
	.prose :global(p) {
		margin: 0 0 1.25em 0;
	}

	/* LINKS — accent underline; light end uses --color-orange for AA on the pale bg */
	.prose :global(a:not(.heading-anchor)) {
		color: light-dark(var(--color-orange), var(--accent-dark));
		text-decoration: underline;
		text-decoration-thickness: 1px;
		text-decoration-color: color-mix(in oklab, currentColor 40%, transparent);
		text-underline-offset: 0.2em;
		transition: text-decoration-color 150ms;
	}
	.prose :global(a:not(.heading-anchor):hover) {
		text-decoration-color: currentColor;
	}
	.prose :global(a[href^='http'])::after {
		content: '↗';
		margin-left: 0.15em;
		font-family: var(--font-mono);
		font-size: 0.75em;
		color: var(--color-muted);
	}

	/* HEADINGS — mono, with a hanging '#' anchor on hover */
	.prose :global(h2),
	.prose :global(h3) {
		position: relative;
		font-family: var(--font-mono);
		font-weight: 600;
		letter-spacing: var(--tracking-tight);
		line-height: 1.4;
		color: var(--color-fg);
		text-wrap: balance;
	}
	.prose :global(h2) {
		margin: 2.5em 0 0.75em 0;
		font-size: 1.0625rem;
	}
	.prose :global(h3) {
		margin: 2em 0 0.5em 0;
		font-size: 1rem;
	}
	.prose :global(.heading-anchor) {
		display: none;
		position: absolute;
		right: calc(100% + 1ch);
		color: var(--color-muted);
		text-decoration: none;
		opacity: 0;
		transition: opacity 150ms;
	}
	.prose :global(.heading-anchor:hover) {
		color: var(--color-accent);
	}
	.prose :global(:is(h2, h3):is(:hover, :focus-within) .heading-anchor) {
		opacity: 1;
	}
	@media (min-width: 640px) {
		.prose :global(.heading-anchor) {
			display: inline;
		}
	}

	/* EMPHASIS */
	.prose :global(strong) {
		font-weight: 600;
	}
	.prose :global(em) {
		font-style: italic;
	}

	/* INLINE CODE — quiet mono chip (wins over the global grey rule inside prose) */
	.prose :global(code:not(pre code)) {
		font-family: var(--font-mono);
		font-size: 0.85em;
		color: var(--color-fg);
		background: var(--color-subtle);
		border: 1px solid var(--color-border);
		padding: 0.1em 0.3em;
		border-radius: 3px;
	}

	/* CODE BLOCK — Shiki output; colors come from --shiki-* in app.css */
	.prose :global(pre) {
		margin: 0 0 1.5em 0;
		padding: 1rem 1.25rem;
		border: 1px solid var(--color-border);
		background: var(--color-subtle) !important;
		font-family: var(--font-mono);
		font-size: 0.875rem;
		line-height: 1.6;
		tab-size: 2;
		overflow-x: auto;
	}
	.prose :global(pre code) {
		font: inherit;
	}
	.prose :global(pre .line.highlighted),
	.prose :global(pre .line.diff) {
		display: inline-block;
		width: calc(100% + 2.5rem);
		margin: 0 -1.25rem;
		padding: 0 1.25rem;
	}
	.prose :global(pre .line.highlighted) {
		background: color-mix(in oklab, var(--color-accent) 12%, transparent);
	}
	.prose :global(pre .line.diff.add) {
		background: color-mix(in oklab, var(--color-green) 14%, transparent);
	}
	.prose :global(pre .line.diff.remove) {
		background: color-mix(in oklab, var(--color-red) 14%, transparent);
		opacity: 0.7;
	}
	.prose :global(pre .line.diff)::before {
		display: inline-block;
		width: 0;
		translate: -1ch 0;
	}
	.prose :global(pre .line.diff.add)::before {
		content: '+';
		color: var(--color-green);
	}
	.prose :global(pre .line.diff.remove)::before {
		content: '−';
		color: var(--color-red);
	}

	/* BLOCKQUOTE */
	.prose :global(blockquote) {
		margin: 0 0 1.25em 0;
		padding-left: 1.25em;
		border-left: 2px solid var(--color-border);
		font-style: italic;
		color: color-mix(in oklab, var(--color-fg) 80%, transparent);
	}

	/* LISTS */
	.prose :global(ul),
	.prose :global(ol) {
		margin: 0 0 1.25em 0;
		padding-left: 1.5em;
	}
	.prose :global(ul) {
		list-style: disc;
	}
	.prose :global(ol) {
		list-style: decimal;
	}
	.prose :global(li + li) {
		margin-top: 0.35em;
	}
	.prose :global(li)::marker {
		color: var(--color-muted);
	}
	.prose :global(ol > li)::marker {
		font-family: var(--font-mono);
		font-size: 0.875em;
	}

	/* TABLES — horizontal rules only, scrolls on narrow screens */
	.prose :global(table) {
		display: block;
		max-width: 100%;
		margin: 0 0 1.5em 0;
		border-collapse: collapse;
		overflow-x: auto;
		font-variant-numeric: tabular-nums;
	}
	.prose :global(th),
	.prose :global(td) {
		padding: 0.4em 1em 0.4em 0;
		border-bottom: 1px solid var(--color-border);
		text-align: left;
	}
	.prose :global(th) {
		font-family: var(--font-mono);
		font-size: 0.875em;
		font-weight: 600;
	}

	/* HR — centered glyph, same family as the notes list */
	.prose :global(hr) {
		margin: 2.5em auto;
		border: none;
		text-align: center;
		overflow: visible;
	}
	.prose :global(hr)::after {
		content: '❋';
		font-family: var(--font-mono);
		color: var(--color-muted);
	}

	/* IMAGES */
	.prose :global(img) {
		display: block;
		max-width: 100%;
		height: auto;
		margin: 1.5em 0;
	}
</style>
