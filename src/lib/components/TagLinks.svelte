<script lang="ts">
	import { resolve } from '$app/paths';
	import { tagSlug } from '$lib/posts';

	let { tags }: { tags: string[] } = $props();
</script>

<span class="inline-flex flex-wrap gap-x-[1ch]">
	{#each tags as tag (tag)}
		<a
			class="text-muted no-underline transition-colors hover:text-accent"
			href={resolve('/notes/tag/[tag]', { tag: tagSlug(tag) })}>#{tag}</a
		>
	{/each}
</span>
