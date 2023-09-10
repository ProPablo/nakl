import { writable } from 'svelte/store';

export const peerId = writable<string | null>(null);