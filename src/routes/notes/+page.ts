import { getPosts, getTags } from '#lib/posts.js';

export const prerender = true;

export function load() {
	return { posts: getPosts(), tags: getTags() };
}
