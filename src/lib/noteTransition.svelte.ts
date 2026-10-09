/**
 * Slug of the note whose title is morphing in the current view transition: the
 * note being opened, or the one being navigated back from. Set in the layout's
 * onNavigate before the old page is captured. NoteTitle only names its words
 * for this slug (so a list of many titles doesn't capture hundreds of groups),
 * and NoteList skips the entrance animation for that row.
 */
export const noteTransition = $state({ slug: null as string | null });

/**
 * Slug of the tag morphing between a tag link and the tag page's heading, set
 * alongside `noteTransition`. TagLinks only names this tag, so a note page's
 * tags don't morph into the notes index.
 */
export const tagTransition = $state({ slug: null as string | null });

const WORD_STAGGER_MS = 5;

/**
 * Cascade the title morph: delay each word's view-transition animations by its
 * index. Call once the transition's pseudo-elements exist (`transition.ready`).
 * Names are `note-<slug>-<index>` (NoteTitle.svelte); slugs may contain digits
 * and hyphens, so the index is the trailing number.
 */
export function staggerNoteWords() {
	if (matchMedia('(prefers-reduced-motion: reduce)').matches) return;

	for (const animation of document.getAnimations()) {
		const effect = animation.effect;
		if (!(effect instanceof KeyframeEffect)) continue;
		const index = effect.pseudoElement?.match(/^::view-transition-[\w-]+\(note-.+-(\d+)\)$/)?.[1];
		if (index) effect.updateTiming({ delay: Number(index) * WORD_STAGGER_MS, fill: 'both' });
	}
}
