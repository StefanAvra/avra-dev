<script lang="ts">
	import { page } from '$app/state';
	import { SITE_AUTHOR, SITE_NAME, SITE_URL } from '$lib/site';

	let {
		title,
		description,
		noindex = false,
		article
	}: {
		/** Page name; the author's name is appended. Omit on the home page. */
		title?: string;
		description: string;
		noindex?: boolean;
		article?: { published: string; tags: string[] };
	} = $props();

	const fullTitle = $derived(title ? `${title} — ${SITE_AUTHOR}` : SITE_AUTHOR);
	// From SITE_URL, not page.url: during prerender its origin is http://sveltekit-prerender.
	const url = $derived(SITE_URL + page.url.pathname);
</script>

<svelte:head>
	<title>{fullTitle}</title>
	<meta name="description" content={description} />
	<link rel="canonical" href={url} />
	{#if noindex}
		<meta name="robots" content="noindex" />
	{/if}

	<meta property="og:site_name" content={SITE_NAME} />
	<meta property="og:title" content={title ?? SITE_AUTHOR} />
	<meta property="og:description" content={description} />
	<meta property="og:url" content={url} />
	<meta property="og:type" content={article ? 'article' : 'website'} />
	<meta name="twitter:card" content="summary" />
	{#if article}
		<meta property="article:published_time" content={article.published} />
		<meta property="article:author" content={SITE_URL} />
		{#each article.tags as tag (tag)}
			<meta property="article:tag" content={tag} />
		{/each}
	{/if}
</svelte:head>
