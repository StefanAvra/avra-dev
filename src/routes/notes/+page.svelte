<script lang="ts">
	import { resolve } from "$app/paths";

	let { data } = $props();
</script>

<main>
	<div class="card">
		<h1>Notes</h1>
		<ul>
			{#each data.posts as post (post.slug)}
				<li class="mb-4">
					<a href={resolve(`/notes/${post.slug}`)} >
						<span class="font-bold">
							{post.title}
						</span>
						<span class="font-light"> — {new Date(post.date).toISOString().slice(0, 10)}</span>
						{#if post.description}
							<p class="">{post.description}</p>
						{/if}
					</a>
				</li>
			{/each}
		</ul>
	</div>
</main>

