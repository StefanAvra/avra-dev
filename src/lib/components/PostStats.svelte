<script lang="ts">
	import MessageSquare from '@lucide/svelte/icons/message-square';
	import Repeat2 from '@lucide/svelte/icons/repeat-2';
	import Heart from '@lucide/svelte/icons/heart';
	import Quote from '@lucide/svelte/icons/message-square-quote';
	import { statPath, type ThreadViewPost } from '$lib/bsky';

	let { post }: { post: ThreadViewPost['post'] } = $props();

	type Sub = '' | 'liked-by' | 'reposted-by' | 'quotes';

	const stats = $derived<{ icon: typeof Heart; count: number; label: string; sub: Sub }[]>([
		{ icon: MessageSquare, count: post.replyCount ?? 0, label: 'replies', sub: '' },
		{ icon: Heart, count: post.likeCount ?? 0, label: 'likes', sub: 'liked-by' },
		{ icon: Repeat2, count: post.repostCount ?? 0, label: 'reposts', sub: 'reposted-by' },
		{ icon: Quote, count: post.quoteCount ?? 0, label: 'quotes', sub: 'quotes' }
	]);
</script>

<section>
	<ul class="m-0 flex list-none items-center gap-[3ch] p-0 text-sm text-muted">
		{#each stats as { icon: Icon, count, label, sub } (label)}
			{#if count > 0}
				<li>
					<a
						href="https://bsky.app{statPath(post.uri, sub)}"
						rel="noreferrer"
						target="_blank"
						aria-label="{count} {count === 1 ? label.slice(0, -1) : label} on Bluesky"
						class="flex items-center gap-[1ch] no-underline hover:text-fg"
					>
						<Icon class="size-[2ch]" strokeWidth={1.5} aria-hidden="true" />
						<span>{count}</span>
					</a>
				</li>
			{/if}
		{/each}
	</ul>
</section>
