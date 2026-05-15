<script lang="ts">
	import EmailTooltip from '$lib/components/EmailTooltip.svelte';

	const timezone = new Intl.DateTimeFormat('en', {
		timeZone: 'Europe/Berlin',
		timeZoneName: 'shortOffset',
	})
		.formatToParts(new Date())
		.find((p) => p.type === 'timeZoneName')?.value;
</script>

<h1 class="">Stefan Avramescu</h1>
<p class="m-0 mb-[1lh]">
	Hi. I'm a full stack engineer based in Europe {timezone}.
	<br />
	Welcome to my personal site. A place to experiment, share notes and projects.
</p>

<div class="flex gap-[2ch]">
	<EmailTooltip />
	<a
		class="bracketed no-underline"
		href="https://github.com/stefanavra"
		target="_blank"
		rel="noopener">github</a
	>
	<!-- <a
		class="bracketed no-underline"
		href="https://www.codewars.com/users/avra"
		target="_blank"
		rel="noopener noreferrer">codewars</a
	> -->
</div>
