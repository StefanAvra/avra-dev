/**
 * Minimal read-only client for the public Bluesky AppView.
 *
 * Everything here is unauthenticated — `public.api.bsky.app` serves the app.bsky.*
 * read endpoints with no token, so no app password ever reaches the browser.
 */

const PUBLIC_APPVIEW = 'https://public.api.bsky.app';
const THREAD_VIEW_POST = 'app.bsky.feed.defs#threadViewPost';

export interface Author {
	did: string;
	handle: string;
	displayName?: string;
	avatar?: string;
}

export interface ThreadViewPost {
	$type?: string;
	post: {
		uri: string;
		cid: string;
		author: Author;
		record: { text?: string; createdAt: string };
		likeCount?: number;
		replyCount?: number;
	};
	replies?: unknown[];
}

/**
 * `thread` and every entry in `replies` are open unions — a reply may come back as
 * `notFoundPost` or `blockedPost` instead of a real post. Narrow before touching it.
 */
export function isThreadViewPost(node: unknown): node is ThreadViewPost {
	if (typeof node !== 'object' || node === null) return false;
	const n = node as { $type?: unknown; post?: { record?: unknown } };
	return n.$type === THREAD_VIEW_POST && typeof n.post?.record === 'object';
}

/** Oldest first, so a thread reads top to bottom. */
export function sortByCreatedAt(replies: ThreadViewPost[]): ThreadViewPost[] {
	return [...replies].sort((a, b) => (a.post.record.createdAt < b.post.record.createdAt ? -1 : 1));
}

/**
 * `at://did/app.bsky.feed.post/rkey` -> the bsky.app path for that post.
 * Returns a path, not a full URL, so callers write the `https://bsky.app` origin
 * literally in the markup — it keeps the link visibly external.
 */
export function postPath(atUri: string): string {
	const [, , did, , rkey] = atUri.split('/');
	return did && rkey ? `/profile/${did}/post/${rkey}` : '/';
}

const UNITS: [limit: number, per: number, suffix: string][] = [
	[60, 1, 's'],
	[3600, 60, 'm'],
	[86400, 3600, 'h'],
	[2592000, 86400, 'd']
];

/** Compact relative timestamp: 5s / 3m / 2h / 6d, then an absolute date. */
export function relativeTime(iso: string, now: number = Date.now()): string {
	const seconds = Math.max(0, (now - new Date(iso).getTime()) / 1000);
	for (const [limit, per, suffix] of UNITS) {
		if (seconds < limit) return `${Math.floor(seconds / per)}${suffix}`;
	}
	return iso.slice(0, 10);
}

/**
 * Fetch the direct replies to `uri`, nested. Browser-only: the site is prerendered,
 * so calling this from a `load` would run at build time and bake in stale comments.
 */
export async function fetchReplies(uri: string, depth = 6): Promise<ThreadViewPost[]> {
	const params = new URLSearchParams({ uri, depth: String(depth) });
	const res = await fetch(`${PUBLIC_APPVIEW}/xrpc/app.bsky.feed.getPostThread?${params}`);
	if (!res.ok) throw new Error(`getPostThread failed: ${res.status}`);

	const { thread } = (await res.json()) as { thread: unknown };
	if (!isThreadViewPost(thread)) throw new Error('Thread unavailable');

	return sortByCreatedAt((thread.replies ?? []).filter(isThreadViewPost));
}
