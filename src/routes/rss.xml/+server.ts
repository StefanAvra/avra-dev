import { getPosts } from '$lib/posts';
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from '$lib/site';

export const prerender = true;

function escapeXml(s: string): string {
	return s
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&apos;');
}

// Summary-only on purpose: feed readers strip scripts and styles, so rich posts
// (Svelte components, per-post CSS) wouldn't survive as full content.
export function GET() {
	const posts = getPosts();

	const items = posts
		.map((post) => {
			const url = `${SITE_URL}/notes/${post.slug}`;
			return `
		<item>
			<title>${escapeXml(post.title)}</title>
			<link>${url}</link>
			<guid isPermaLink="true">${url}</guid>
			<pubDate>${new Date(post.date).toUTCString()}</pubDate>
			<description>${escapeXml(post.description)}</description>${post.tags
				.map((tag) => `\n\t\t\t<category>${escapeXml(tag)}</category>`)
				.join('')}
		</item>`;
		})
		.join('');

	const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
	<channel>
		<title>${escapeXml(SITE_NAME)}</title>
		<link>${SITE_URL}</link>
		<description>${escapeXml(SITE_DESCRIPTION)}</description>
		<language>en</language>${posts.length ? `\n\t\t<lastBuildDate>${new Date(posts[0].date).toUTCString()}</lastBuildDate>` : ''}
		<atom:link href="${SITE_URL}/rss.xml" rel="self" type="application/rss+xml" />${items}
	</channel>
</rss>
`;

	return new Response(xml, {
		headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' }
	});
}
