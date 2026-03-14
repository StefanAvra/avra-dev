import { goto } from '$app/navigation';
import { resolve } from '$app/paths';
import { writable } from 'svelte/store';

export const showHelp = writable(false);
export const keyboardActive = writable(false);
export const keyBuffer = writable<string[]>([]);
export const konamiTriggered = writable(false);

let keyboardTimer: ReturnType<typeof setTimeout>;

function isEditable(target: EventTarget | null): boolean {
	if (!(target instanceof HTMLElement)) return false;
	const tag = target.tagName;
	if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT') return true;
	if (target.isContentEditable) return true;
	return false;
}

export function handleHotkey(event: KeyboardEvent, toggleTheme: () => void) {
	if (event.ctrlKey || event.altKey || event.metaKey) return;
	if (isEditable(event.target)) return;

	const key = event.key;

	clearTimeout(keyboardTimer);
	keyboardActive.set(true);
	keyboardTimer = setTimeout(() => keyboardActive.set(false), 3000);

	keyBuffer.update((keys) => {
		const updated = [...keys, key].slice(-128);
		const KONAMI = 'ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba';
		if (updated.join('').endsWith(KONAMI)) {
			konamiTriggered.set(true);
		}
		return updated;
	});

	switch (key) {
		case 'h':
			event.preventDefault();
			goto(resolve('/'));
			break;
		case 'n':
			event.preventDefault();
			goto(resolve('/notes'));
			break;
		case 't':
			event.preventDefault();
			toggleTheme();
			break;
		case '?':
			event.preventDefault();
			showHelp.update((v) => !v);
			break;
		case 'Escape':
			showHelp.update((v) => {
				if (v) {
					event.preventDefault();
					return false;
				}
				history.back();
				return false;
			});
			break;
		case 'Backspace':
			event.preventDefault();
			history.back();
			break;
		case 'j':
		case 'ArrowDown':
			navigateList(event, 1);
			break;
		case 'k':
		case 'ArrowUp':
			navigateList(event, -1);
			break;
		case 'Enter':
			activateItem(event);
			break;
	}
}

function navigateList(event: KeyboardEvent, direction: number) {
	const items = document.querySelectorAll<HTMLElement>('[data-hotkey-item]');
	if (items.length === 0) return;

	event.preventDefault();

	const current = document.querySelector<HTMLElement>('[data-hotkey-active]');
	let index = -1;

	if (current) {
		items.forEach((el, i) => {
			if (el === current) index = i;
		});
		current.removeAttribute('data-hotkey-active');
	}

	let next = index + direction;
	if (next < 0) next = items.length - 1;
	if (next >= items.length) next = 0;

	items[next].setAttribute('data-hotkey-active', '');
	items[next].scrollIntoView({ block: 'nearest' });
}

function activateItem(event: KeyboardEvent) {
	const active = document.querySelector<HTMLElement>('[data-hotkey-active]');
	if (!active) return;

	event.preventDefault();
	const link = active.tagName === 'A' ? active : active.querySelector('a');
	if (link) (link as HTMLElement).click();
}
