import { error } from '@sveltejs/kit';
import { getPosts, getTags, tagSlug } from '$lib/posts';
import type { EntryGenerator, PageLoad } from './$types';

export const prerender = true;

export const entries: EntryGenerator = () => getTags().map(({ slug }) => ({ tag: slug }));

export const load: PageLoad = ({ params }) => {
	const tag = getTags().find(({ slug }) => slug === params.tag);
	if (!tag) error(404, `No notes tagged ${params.tag}`);

	return {
		tag: tag.tag,
		posts: getPosts().filter((post) => post.tags.some((t) => tagSlug(t) === params.tag))
	};
};
