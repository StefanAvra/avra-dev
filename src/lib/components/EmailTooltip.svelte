<script lang="ts">
	const r = (s: string) => [...s].reverse().join('');
	let address = $state<string>();

	function reveal() {
		address ??= `${r('ih')}@${r('ved.arva')}`;
	}

	// Screen readers in browse mode can activate a link without focusing it.
	function onclick(event: MouseEvent) {
		if (address) return;
		event.preventDefault();
		reveal();
		location.href = `mailto:${address}`;
	}
</script>

<div class="group relative">
	<a
		id="email"
		class="bracketed no-underline"
		href={address ? `mailto:${address}` : '#email'}
		aria-describedby="email-address"
		onpointerenter={reveal}
		onfocus={reveal}
		{onclick}>email</a
	>
	<div
		id="email-address"
		role="tooltip"
		class="invisible absolute top-[1lh] left-0 z-100 box-border w-max border border-border bg-subtle px-[1ch] py-0 text-center text-base leading-normal group-focus-within:visible group-hover:visible"
	>
		{address ?? 'hi@[this domain]'}
	</div>
</div>
