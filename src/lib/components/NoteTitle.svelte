<script lang="ts">
	import { noteTransition } from '#lib/noteTransition.svelte.js';

	// `always` names the words even when this title isn't the morphing one —
	// used on the note page, where there's only ever one title.
	let { slug, title, always = false }: { slug: string; title: string; always?: boolean } = $props();

	const words = $derived(title.split(/\s+/));
	const named = $derived(always || noteTransition.slug === slug);
</script>

<!-- Each word is its own view-transition group so words can change rows when the
     title wraps differently in the list and on the note page. -->
{#each words as word, i (i)}{@const space = i < words.length - 1 ? ' ' : ''}<span
		class="inline-block [view-transition-class:note-word]"
		style:view-transition-name={named ? `note-${slug}-${i}` : undefined}>{word}</span
	>{space}{/each}
