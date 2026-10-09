import { noteStats } from '$lib/noteStats';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = async () => {
	const modules = import.meta.glob('/src/lib/posts/*.md');
	return Object.keys(modules).map((path) => ({
		slug: path.split('/').at(-1)!.replace('.md', '')
	}));
};

export const load: PageLoad = async ({ params }) => {
	const modules = import.meta.glob('../../../lib/posts/*.md');
	const raws = import.meta.glob<string>('../../../lib/posts/*.md', {
		query: '?raw',
		import: 'default'
	});
	const path = `../../../lib/posts/${params.slug}.md`;
	const mod = (await modules[path]()) as {
		default: unknown;
		metadata: {
			title: string;
			date: string;
			description: string;
			atproto_uri?: string;
			bsky_thread_uri?: string;
			tags?: string[];
		};
	};
	return {
		content: mod.default,
		title: mod.metadata.title,
		date: mod.metadata.date,
		description: mod.metadata.description,
		atproto_uri: mod.metadata.atproto_uri,
		bsky_thread_uri: mod.metadata.bsky_thread_uri,
		tags: (mod.metadata.tags ?? []).filter(Boolean),
		slug: params.slug,
		stats: noteStats(await raws[path]())
	};
};
