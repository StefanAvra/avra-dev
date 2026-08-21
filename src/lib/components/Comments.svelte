<script lang="ts">
	import { onMount } from 'svelte';
	import CommentThread from './CommentThread.svelte';
	import { fetchReplies, postPath, type ThreadViewPost } from '$lib/bsky';

	let { uri }: { uri: string } = $props();

	let replies = $state<ThreadViewPost[] | null>(null);
	let failed = $state(false);

	const path = $derived(postPath(uri));

	onMount(async () => {
		try {
			replies = await fetchReplies(uri);
		} catch {
			failed = true;
		}
	});
</script>

<section class="mt-[1lh]">
	<h2 class="m-0 mb-[1lh] text-base">Comments</h2>

	{#if replies === null && !failed}
		<p class="m-0 text-sm text-muted">Loading…</p>
	{:else if replies?.length}
		{#each replies as reply (reply.post.uri)}
			<CommentThread {reply} />
		{/each}
	{:else if failed}
		<p class="m-0 text-sm text-muted">Couldn't load comments.</p>
	{:else}
		<p class="m-0 text-sm text-muted">No comments yet.</p>
	{/if}

	<p class="m-0 mt-[1lh] text-sm">
		<a href="https://bsky.app{path}" rel="noreferrer" target="_blank" class="bracketed text-accent no-underline"
			>Reply on Bluesky</a
		>
	</p>
</section>
