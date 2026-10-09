<script lang="ts">
	import Meta from '#lib/components/Meta.svelte';
	import NoteList from '#lib/components/NoteList.svelte';
	import { SITE_DESCRIPTION } from '#lib/site.js';
	import TagLinks from '#lib/components/TagLinks.svelte';
	let { data } = $props();
</script>

<Meta title="Notes" description={SITE_DESCRIPTION} />

<h1>Notes</h1>
{#if data.tags.length}
	<p class="m-0 -mt-[0.5lh] mb-[1lh] text-sm">
		<TagLinks tags={data.tags.map((t) => t.tag)} />
	</p>
{/if}
<NoteList posts={data.posts} />
