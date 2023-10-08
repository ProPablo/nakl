import { localStorageStore, type PopupSettings } from '@skeletonlabs/skeleton';
import { writable, type Writable } from 'svelte/store';

export const peerId = writable<string | null>(null);
export const popupMsg = writable<string>("");
export const advancedMode: Writable<boolean> = localStorageStore('advancedMode', false);
// REF: https://svelte.dev/examples/custom-stores
function createMediaQueryStore(query: string) {
  const initialValue = window.matchMedia(query).matches;
  let isDesktop = writable<boolean>(initialValue);
  window
    .matchMedia(query)
    .addEventListener('change', (e) => (isDesktop.set(e.matches)));
  return isDesktop;
}

// based on lg tailwind viewport
export const isDesktop = createMediaQueryStore('(min-width: 1024px)');