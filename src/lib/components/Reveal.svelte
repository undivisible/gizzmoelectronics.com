<script lang="ts">
  import { onMount } from 'svelte';
  export let as: string = 'div';
  export let threshold = 0.2;
  export let y = 24;
  export let duration = 600;
  export let delay = 0;
  export let once = true;
  let el: HTMLElement;
  let visible = false;
  onMount(() => {
    const io = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        visible = true;
        if (once) io.disconnect();
      } else if (!once) {
        visible = false;
      }
    }, { threshold });
    io.observe(el);
    return () => io.disconnect();
  });
</script>

<svelte:element this={as} bind:this={el} class:reveal-visible={visible} class="reveal-wrapper" style={`--y:${y}px; --dur:${duration}ms; --delay:${delay}ms;`}>
  <slot />
</svelte:element>

<style>
  .reveal-wrapper { opacity:0; transform: translate3d(0,var(--y),0); transition: opacity var(--dur) cubic-bezier(.22,.8,.32,1) var(--delay), transform var(--dur) cubic-bezier(.22,.8,.32,1) var(--delay); will-change:opacity,transform; }
  .reveal-visible { opacity:1; transform:translate3d(0,0,0); }
</style>
