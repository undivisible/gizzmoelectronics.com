import { writable, derived } from 'svelte/store';

export const sidebarOpen = writable(false);
export const headerVisible = writable(true); // dynamic toggle on scroll / hero
export const heroInView = writable(true);

export const shiftMain = derived(sidebarOpen, ($o) => $o);

let lastScroll = 0;
export const scrollingDown = writable(false);
export const scrollingUp = writable(false);

export function handleScroll(y: number) {
  const down = y > lastScroll;
  scrollingDown.set(down);
  scrollingUp.set(!down);
  lastScroll = y;
}

export function toggleSidebar(force?: boolean) {
  sidebarOpen.update(v => force === undefined ? !v : force);
}
