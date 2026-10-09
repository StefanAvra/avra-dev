<script lang="ts">
	import NoteList from '$lib/components/NoteList.svelte';
	let { data } = $props();
</script>

<h1>#{data.tag}</h1>
<NoteList posts={data.posts} />
