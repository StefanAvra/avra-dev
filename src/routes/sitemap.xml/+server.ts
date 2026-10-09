import { getPosts, getTags, tagSlug } from '$lib/posts';
import { SITE_URL } from '$lib/site';

export const prerender = true;

// /privacy is left out on purpose: it's noindex (see Meta in privacy/+page.svelte).
export function GET() {
	const posts = getPosts();
	// Posts are newest first, so the first match is a listing's last change.
	const newest = (tag?: string) =>
		posts.find((post) => !tag || post.tags.some((t) => tagSlug(t) === tag))?.date;

	const urls: { path: string; lastmod?: string }[] = [
		{ path: '/' },
		{ path: '/notes', lastmod: newest() },
		...posts.map((post) => ({ path: `/notes/${post.slug}`, lastmod: post.date })),
		...getTags().map(({ slug }) => ({ path: `/notes/tag/${slug}`, lastmod: newest(slug) })),
		{ path: '/projects' }
	];

	const entries = urls
		.map(
			({ path, lastmod }) => `
	<url>
		<loc>${SITE_URL}${path}</loc>${lastmod ? `\n\t\t<lastmod>${lastmod.slice(0, 10)}</lastmod>` : ''}
	</url>`
		)
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${entries}
</urlset>
`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/xml; charset=utf-8' }
	});
}
