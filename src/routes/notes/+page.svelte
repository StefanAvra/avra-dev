<script lang="ts">
	import { resolve } from '$app/paths';
	import Breadcrumb from '$lib/components/Breadcrumb.svelte';

	let { data } = $props();
</script>

<main>
	<Breadcrumb path="~/notes" />
	<h1>Notes</h1>
	<hr />
	<ul>
		{#each data.posts as post (post.slug)}
			<li>
				<a href={resolve(`/notes/${post.slug}`)}>
					<span>{post.title}</span>
					<span class="fg-muted">{new Date(post.date).toISOString().slice(0, 10)}</span>
				</a>
				{#if post.description}
					<p class="fg-muted">{post.description}</p>
				{/if}
			</li>
		{/each}
	</ul>
</main>

<style>
	hr {
		border: none;
		border-top: 1px solid var(--border);
		margin: 1lh 0;
	}

	ul {
		list-style: none;
		padding: 0;
		margin: 0;
		display: flex;
		flex-direction: column;
		gap: 1lh;
	}

	li a {
		display: flex;
		gap: 2ch;
		text-decoration: none;
	}
</style>
