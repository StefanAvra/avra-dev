<script lang="ts">
	import { resolve } from '$app/paths';
	let { data } = $props();
</script>

<h1>Notes</h1>

<ul class="m-0 flex list-none flex-col p-0">
	{#each data.posts as post, index (post.slug)}
		<li
			class="animate-fade-in-up text-muted opacity-0"
			data-hotkey-item
			style="animation-delay: {index * 40}ms"
		>
			<a
				class="group relative flex justify-between gap-[2ch] py-[0.5lh] transition hover:text-fg"
				href={resolve(`/notes/${post.slug}`)}
			>
				<span class="">{post.title}</span>
				<span class="shrink-0 text-sm text-muted"
					>{new Date(post.date).toISOString().slice(0, 10)}</span
				>
			</a>
			<!-- {#if post.description}
				<p class="m-0 text-muted">{post.description}</p>
			{/if} -->
		</li>
	{/each}
</ul>

<style>
	li::before {
		content: '❋';
		position: absolute;
		right: calc(100% + 1ch);
		top: 50%;
		translate: 0 -50%;
		opacity: 0%;
	}
	:global(li[data-hotkey-active]) a {
		color: var(--color-fg);
	}
	:global(li[data-hotkey-active])::before,
	li:hover::before {
		color: var(--color-accent);
		opacity: 100%;
		animation:
			cycle-symbol 2s steps(1) infinite,
			bounce-y 1s ease-in-out alternate infinite;
	}
	@keyframes cycle-symbol {
		0% {
			content: '❋';
		}
		8.33% {
			content: '✼';
		}
		16.67% {
			content: '✽';
		}
		25% {
			content: '❈';
		}
		33.33% {
			content: '✴';
		}
		41.67% {
			content: '✳';
		}
		50% {
			content: '✦';
		}
		58.33% {
			content: '✶';
		}
		66.67% {
			content: '❊';
		}
		75% {
			content: '✹';
		}
		83.33% {
			content: '❁';
		}
		91.67% {
			content: '❇';
		}
	}
	@keyframes bounce-y {
		0% {
			translate: 0 -60%;
		}

		100% {
			translate: 0 -40%;
		}
	}
</style>
