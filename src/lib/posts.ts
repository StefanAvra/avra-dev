export interface PostMeta {
	slug: string;
	title: string;
	date: string;
	description: string;
	tags: string[];
}

interface Frontmatter {
	title: string;
	date: string;
	description?: string;
	tags?: string[];
}

/** All notes, newest first. */
export function getPosts(): PostMeta[] {
	const modules = import.meta.glob<Frontmatter>('/src/lib/posts/*.md', {
		eager: true,
		import: 'metadata'
	});

	const posts = Object.entries(modules).map(([path, meta]) => ({
		slug: path.split('/').at(-1)!.replace('.md', ''),
		title: meta?.title,
		date: meta?.date,
		description: meta?.description ?? '',
		tags: (meta?.tags ?? []).filter(Boolean)
	}));

	return posts.sort((a, b) => (a.date > b.date ? -1 : 1));
}

/** URL segment for a tag — same rule as the slug in scripts/new-note.js. */
export function tagSlug(tag: string): string {
	return tag
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/^-|-$/g, '');
}

/** Every tag in use, most-used first. */
export function getTags(): { tag: string; slug: string; count: number }[] {
	const counts = new Map<string, { tag: string; slug: string; count: number }>();
	for (const post of getPosts()) {
		for (const tag of post.tags) {
			const slug = tagSlug(tag);
			const entry = counts.get(slug) ?? { tag, slug, count: 0 };
			entry.count++;
			counts.set(slug, entry);
		}
	}
	return [...counts.values()].sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
}
