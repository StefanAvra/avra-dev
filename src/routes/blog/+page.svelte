<script lang="ts">
	let { data } = $props();
</script>

<main>
	<div class="card">
		<h1>Blog</h1>
		<ul>
			{#each data.posts as post}
				<li>
					<a href="/blog/{post.slug}">{post.title}</a>
					<span class="text-smaller"> — {post.date}</span>
					{#if post.description}
						<p class="text-smaller">{post.description}</p>
					{/if}
				</li>
			{/each}
		</ul>
	</div>
</main>
