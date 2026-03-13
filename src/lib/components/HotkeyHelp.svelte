<script lang="ts">
	import { showHelp } from '$lib/actions/hotkeys';

	function close() {
		showHelp.set(false);
	}
</script>

{#if $showHelp}
	<!-- svelte-ignore a11y_no_static_element_interactions -->
	<div
		class="fixed inset-0 z-50 flex items-center justify-center bg-bg/80"
		onkeydown={(e) => e.key === 'Escape' && close()}
		onclick={close}
	>
		<!-- svelte-ignore a11y_click_events_have_key_events -->
		<div
			class="w-full max-w-[50ch] animate-reveal-in-center border border-border bg-subtle p-[2ch]"
			onclick={(e) => e.stopPropagation()}
		>
			<h2 class="m-0 mb-[1lh] text-base">Keyboard shortcuts</h2>
			<table class="w-full text-sm">
				<tbody>
					<tr><td class="py-0.5 text-accent">h</td><td>Go home</td></tr>
					<tr><td class="py-0.5 text-accent">n</td><td>Go to notes</td></tr>
					<tr><td class="py-0.5 text-accent">t</td><td>Toggle theme</td></tr>
					<tr><td class="py-0.5 text-accent">j / ↓</td><td>Next item in list</td></tr>
					<tr><td class="py-0.5 text-accent">k / ↑</td><td>Previous item in list</td></tr>
					<tr><td class="py-0.5 text-accent">Enter</td><td>Open focused item</td></tr>
					<tr><td class="py-0.5 text-accent">Escape</td><td>Go back / close dialog</td></tr>
					<tr><td class="py-0.5 text-accent">Backspace</td><td>Go back</td></tr>
					<tr><td class="py-0.5 text-accent">?</td><td>Toggle this help</td></tr>
				</tbody>
			</table>
			<!-- <p class="mt-[1lh] mb-0 text-xs text-muted">Hotkeys are disabled while typing in inputs.</p> -->
		</div>
	</div>
{/if}
