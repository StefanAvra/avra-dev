<script lang="ts">
	import Meta from '$lib/components/Meta.svelte';
	import NoteList from '$lib/components/NoteList.svelte';
	import { tagSlug } from '$lib/posts';
	let { data } = $props();
</script>

<Meta title="#{data.tag}" description="Notes tagged #{data.tag}." />

<h1>
	<!-- Morphs from the tag link on /notes (TagLinks.svelte). -->
	<span
		class="inline-block [view-transition-class:note-word]"
		style:view-transition-name="tag-{tagSlug(data.tag)}">#{data.tag}</span
	>
</h1>
<NoteList posts={data.posts} />
