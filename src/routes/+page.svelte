<script lang="ts">
	import Meta from '$lib/components/Meta.svelte';
	import EmailTooltip from '$lib/components/EmailTooltip.svelte';
	import GithubIcon from '$lib/components/GithubIcon.svelte';

	const timezone = new Intl.DateTimeFormat('en', {
		timeZone: 'Europe/Berlin',
		timeZoneName: 'shortOffset'
	})
		.formatToParts(new Date())
		.find((p) => p.type === 'timeZoneName')?.value;
</script>

<Meta
	description="Full stack engineer based in Europe. A place to experiment, share notes and projects."
/>

<h1 class="">Stefan Avramescu</h1>
<p class="m-0 mb-[1lh]">
	Hi. I'm a full stack engineer based in Europe {timezone}.
	<br />
	Welcome to my personal site. A place to experiment, share notes and projects.
</p>

<div class="flex items-center gap-[2ch]">
	<EmailTooltip />
	<a
		class="flex transition-colors hover:text-accent"
		href="https://github.com/stefanavra"
		target="_blank"
		rel="noreferrer"
		aria-label="GitHub"
	>
		<GithubIcon class="size-[2ch]" strokeWidth={1.5} aria-hidden="true" />
	</a>
</div>
