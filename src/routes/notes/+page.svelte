<script lang="ts">
	import NoteList from '$lib/components/NoteList.svelte';
	import TagLinks from '$lib/components/TagLinks.svelte';
	let { data } = $props();
</script>

<h1>Notes</h1>
{#if data.tags.length}
	<p class="m-0 -mt-[0.5lh] mb-[1lh] text-sm">
		<TagLinks tags={data.tags.map((t) => t.tag)} />
	</p>
{/if}
<NoteList posts={data.posts} />
