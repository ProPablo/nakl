import { localStorageStore } from '@skeletonlabs/skeleton';
import { writable, type Writable } from 'svelte/store';

export const peerId = writable<string | null>(null);
export const advancedMode: Writable<boolean> = localStorageStore('advancedMode', false);