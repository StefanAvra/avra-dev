<script lang="ts">
	import EmailTooltip from '$lib/components/EmailTooltip.svelte';
</script>

<svelte:head>
	<title>Imprint &amp; privacy — Stefan Avramescu</title>
</svelte:head>

<h1 class="m-0 mb-[1lh] font-extrabold">Imprint &amp; privacy</h1>
<hr class="my-[1lh] border-t border-none border-border" />

<h2 class="m-0 mb-[0.5lh] text-base font-bold">Imprint</h2>
<p class="m-0 mb-[1lh]">
	Information according to § 5 DDG
	<br />
	<br />
	Stefan Avramescu
	<br />
	Wunnensteinstr. 41
	<br />
	70186 Stuttgart
	<br />
	Germany
	<br />
	<br />
	Email: imprint<span class="hidden">.nospam</span>@<span class="hidden">example.</span>avra.dev
</p>

<h2 class="m-0 mb-[0.5lh] text-base font-bold">Privacy</h2>
<p class="m-0 mb-[1lh]">
	This site is static. There is no server of mine, no database, no accounts, no forms, no cookies,
	no analytics and no advertising. Most of what a privacy policy usually covers doesn't happen here.
	What follows is the rest.
</p>

<h2 class="m-0 mb-[0.5lh] text-base font-bold">Who's responsible</h2>
<p class="m-0 mb-[0.5lh]">Stefan Avramescu is the controller for this site. Reach me at:</p>
<div class="mb-[1lh] flex gap-[2ch]">
	<EmailTooltip />
</div>

<h2 class="m-0 mb-[0.5lh] text-base font-bold">Hosting</h2>
<p class="m-0 mb-[1lh]">
	avra.dev is served by GitHub Pages (GitHub, Inc., a Microsoft company). To deliver a page,
	GitHub's servers process your IP address, your user-agent string, the URL you asked for and the
	time you asked for it, and keep that in their logs to run the service and defend it against abuse.
	That processing is GitHub's, under their privacy statement — I have no access to those logs and
	keep none of my own. The legal basis is legitimate interest in operating a working, secure website
	(Art. 6(1)(f) GDPR). GitHub is based in the United States; transfers rest on GitHub's data
	protection agreement and its certification under the EU-US Data Privacy Framework. See the
	<a
		class="text-accent no-underline"
		href="https://docs.github.com/en/site-policy/privacy-policies/github-general-privacy-statement"
		target="_blank"
		rel="noreferrer">GitHub Privacy Statement</a
	>.
</p>

<h2 class="m-0 mb-[0.5lh] text-base font-bold">Comments</h2>
<p class="m-0 mb-[1lh]">
	Comments here are replies to a post of mine on Bluesky. Nothing is stored on this site. When you
	open a note that has a comment thread, your browser fetches that thread directly from Bluesky's
	public API at public.api.bsky.app and loads each commenter's avatar from cdn.bsky.app. Those are
	requests from your browser to Bluesky Social PBC, so they receive your IP address and your
	user-agent. They can also see that the request came from avra.dev, but not which note you were
	reading: the API call sends only the site's origin, and the avatars are requested with no referrer
	at all. Nothing is requested when the page loads: the fetch waits until the comments are about to
	scroll into view, so if you leave a note before reaching them, your browser never contacts Bluesky
	at all. On a short note, or in a browser too old to defer, that point comes immediately. The
	request carries no token and no cookie. The legal basis is legitimate interest in showing the
	comments that belong to the post you opened (Art. 6(1)(f) GDPR). Bluesky Social PBC is based in
	the United States; see
	<a
		class="text-accent no-underline"
		href="https://bsky.social/about/support/privacy-policy"
		target="_blank"
		rel="noreferrer">their privacy policy</a
	>.
</p>

<h2 class="m-0 mb-[0.5lh] text-base font-bold">If you left a comment</h2>
<p class="m-0 mb-[1lh]">
	Your handle, display name, avatar and post text are public Bluesky content, fetched fresh every
	time someone opens the page. Delete or detach your reply on Bluesky and it is gone from here the
	next time the page loads — there is no copy of it for me to delete.
</p>

<h2 class="m-0 mb-[0.5lh] text-base font-bold">Theme preference</h2>
<p class="m-0 mb-[1lh]">
	If you switch between light and dark, your browser stores one entry, <code>theme</code>, holding
	the word <code>dark</code> or <code>light</code>. It stays on your device, is never sent anywhere
	and identifies nothing. It is not a cookie and not tracking, which is why this site has no consent
	banner. Clearing site data removes it.
</p>

<h2 class="m-0 mb-[0.5lh] text-base font-bold">What else runs in your browser</h2>
<p class="m-0 mb-[1lh]">
	A short script reads your user-agent to detect Safari and work around a rendering quirk. Recent
	key presses are held in memory to drive the keyboard shortcuts and one easter egg. Neither leaves
	your device, and neither is written down.
</p>

<h2 class="m-0 mb-[0.5lh] text-base font-bold">Links out</h2>
<p class="m-0 mb-[1lh]">
	Links to bsky.app, github.com and elsewhere are ordinary links. Once you follow one, that site's
	own privacy policy applies.
</p>

<h2 class="m-0 mb-[0.5lh] text-base font-bold">Your rights</h2>
<p class="m-0 mb-[1lh]">
	Under the GDPR you can ask to access, correct, erase, restrict or port your personal data, and you
	can object to it being processed. You can also lodge a complaint with a data protection
	supervisory authority. In practice this site holds no personal data of its own: anything about
	server logs is GitHub's to answer, and anything about posts and profiles is Bluesky's. For
	everything else, including this page, email me.
</p>

<h2 class="m-0 mb-[0.5lh] text-base font-bold">Changes</h2>
<p class="m-0">If what the site does changes, this page changes with it.</p>
