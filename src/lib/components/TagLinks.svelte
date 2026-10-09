<script lang="ts">
	import { resolve } from '$app/paths';
	import { tagTransition } from '$lib/noteTransition.svelte';
	import { tagSlug } from '$lib/posts';

	let { tags }: { tags: string[] } = $props();
</script>

<span class="inline-flex flex-wrap gap-x-[1ch]">
	{#each tags as tag (tag)}
		{@const slug = tagSlug(tag)}
		<a
			class="text-muted no-underline transition-colors [view-transition-class:note-word] hover:text-accent"
			style:view-transition-name={tagTransition.slug === slug ? `tag-${slug}` : undefined}
			href={resolve('/notes/tag/[tag]', { tag: slug })}>#{tag}</a
		>
	{/each}
</span>
