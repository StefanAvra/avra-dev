<script lang="ts">
	import Self from './CommentThread.svelte';
	import {
		isThreadViewPost,
		postPath,
		relativeTime,
		sortByCreatedAt,
		type ThreadViewPost
	} from '$lib/bsky';
	import PostStats from './PostStats.svelte';

	let { reply, index }: { reply: ThreadViewPost; index: number } = $props();

	const author = $derived(reply.post.author);
	const nested = $derived(sortByCreatedAt((reply.replies ?? []).filter(isThreadViewPost)));
</script>

<article class="mb-[1lh] animate-fade-in-up opacity-0"
			style="animation-delay: {index * 40}ms"

>
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

	<div class="my-[1lh]">
		<PostStats post={reply.post} />
	</div>

	{#if nested.length}
		<div class="mt-[0.5lh] border-l border-dashed border-border pl-[2ch]">
			{#each nested as child, idx (child.post.uri)}
				<Self reply={child} index={idx} />
			{/each}
		</div>
	{/if}
</article>
