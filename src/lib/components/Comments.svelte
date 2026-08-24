<script lang="ts">
	import { onMount } from 'svelte';
	import CommentThread from './CommentThread.svelte';
	import PostStats from './PostStats.svelte';
	import {
		fetchThread,
		isThreadViewPost,
		postPath,
		sortByCreatedAt,
		type ThreadViewPost
	} from '$lib/bsky';

	let { uri }: { uri: string } = $props();

	let thread = $state<ThreadViewPost | null>(null);
	let failed = $state(false);

	const path = $derived(postPath(uri));
	const replies = $derived(
		thread ? sortByCreatedAt((thread.replies ?? []).filter(isThreadViewPost)) : null
	);

	onMount(async () => {
		try {
			thread = await fetchThread(uri);
		} catch {
			failed = true;
		}
	});
</script>

<section class="mt-[1lh]">
	<div class="mb-[1lh] min-h-[2ch]">
		{#if thread}
			<PostStats post={thread.post} />
		{/if}
	</div>

	<h2 class="m-0 mb-[1lh] text-base">Comments</h2>

	{#if replies === null && !failed}
		<p class="m-0 text-sm text-muted">Loading…</p>
	{:else if replies?.length}
		{#each replies as reply, index (reply.post.uri)}
			<CommentThread {reply} {index} />
		{/each}
	{:else if failed}
		<p class="m-0 text-sm text-muted">Couldn't load comments.</p>
	{:else}
		<p class="m-0 text-sm text-muted">No comments yet.</p>
	{/if}

	{#if replies !== null}
		<p class="m-0 mt-[1lh] text-sm">
			<a
				href="https://bsky.app{path}"
				rel="noreferrer"
				target="_blank"
				class="bracketed text-accent no-underline">Reply on Bluesky</a
			>
		</p>
	{/if}
</section>
