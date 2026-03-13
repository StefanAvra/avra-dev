export const prerender = true;

interface PostMeta {
	title: string;
	date: string;
	description: string;
}

interface PostModule {
	metadata: PostMeta;
}

export function load() {
	const modules = import.meta.glob<PostModule>('/src/lib/posts/*.md', { eager: true });

	const posts = Object.entries(modules).map(([path, mod]) => {
		const slug = path.split('/').at(-1)!.replace('.md', '');
		return {
			slug,
			title: mod.metadata?.title,
			date: mod.metadata?.date,
			description: mod.metadata?.description
		};
	});

	posts.sort((a, b) => (a.date > b.date ? -1 : 1));

	return { posts };
}
