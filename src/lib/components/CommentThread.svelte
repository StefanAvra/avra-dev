<script lang="ts">
	import Self from './CommentThread.svelte';
	import {
		isThreadViewPost,
		postPath,
		relativeTime,
		sortByCreatedAt,
		type ThreadViewPost
	} from '$lib/bsky';

	let { reply }: { reply: ThreadViewPost } = $props();

	const author = $derived(reply.post.author);
	const nested = $derived(sortByCreatedAt((reply.replies ?? []).filter(isThreadViewPost)));
</script>

<article class="mb-[1lh]">
	<div class="mb-[0.25lh] flex items-baseline gap-[1ch] text-sm">
		{#if author.avatar}
			<img
				src={author.avatar}
				alt=""
				loading="lazy"
				class="size-[2ch] shrink-0 self-center rounded-full border border-border"
			/>
		{/if}
		<a
			href="https://bsky.app/profile/{author.handle}"
			rel="noreferrer"
			target="_blank"
			class="truncate text-accent no-underline">@{author.handle}</a
		>
		<span class="text-muted">·</span>
		<a
			href="https://bsky.app{postPath(reply.post.uri)}"
			rel="noreferrer"
			target="_blank"
			class="text-muted no-underline hover:text-fg"
			title={reply.post.record.createdAt}>{relativeTime(reply.post.record.createdAt)}</a
		>
	</div>

	{#if reply.post.record.text}
		<p class="m-0 whitespace-pre-wrap">{reply.post.record.text}</p>
	{:else}
		<p class="m-0 text-sm text-muted italic">(no text)</p>
	{/if}

	{#if reply.post.likeCount}
		<p class="m-0 text-sm text-muted">&hearts; {reply.post.likeCount}</p>
	{/if}

	{#if nested.length}
		<div class="mt-[0.5lh] border-l border-dashed border-border pl-[2ch]">
			{#each nested as child (child.post.uri)}
				<Self reply={child} />
			{/each}
		</div>
	{/if}
</article>
