<script lang="ts">
  import { onMount, onDestroy } from 'svelte';
  import { cubicOut, cubicInOut } from 'svelte/easing';
  import { tweened } from 'svelte/motion';
  import { fade } from 'svelte/transition';
  let reduceMotion = false;

  import type { Slide } from '../types/slider';

  export let slides: Slide[] = [
    {
      id: 'performance',
      title: 'Extreme Boost Control',
      subtitle: 'Precision for every PSI',
      gradient: 'linear-gradient(135deg,#0f2027,#203a43,#2c5364)',
      content: 'Closed-loop accuracy with adaptive algorithms.'
    },
    {
      id: 'intelligence',
      title: 'Adaptive Learning',
      subtitle: 'Smarter each run',
      gradient: 'linear-gradient(135deg,#23074d,#cc5333)',
      content: 'Real-time compensation for temperature & altitude.'
    },
    {
      id: 'control',
      title: 'Launch & Traction Assist',
      subtitle: 'Hook hard. Stay ahead.',
      gradient: 'linear-gradient(135deg,#000428,#004e92)',
      content: 'Multi-mode strategies for any surface condition.'
    }
  ];
  
  export let autoplay = true;
  export let interval = 6000;
  export let pauseOnHover = true;
  export let showIndicators = true;
  export let showArrows = true;
  export let loop = true;

  let current = 0;
  let prevIndex = 0;
  let hovered = false;
  let timer: any;
  let dragging = false;
  let dragStartX = 0;
  let dragDelta = 0;

  const progress = tweened(0, { duration: interval, easing: cubicOut });
  const gradientProgress = tweened(0, { duration: 650, easing: cubicInOut });

  function startTimer() {
    if (!autoplay) return;
    progress.set(0, { duration: 0 });
    progress.set(1, { duration: interval });
    timer = setTimeout(() => next(), interval);
  }
  function clearTimer() { if (timer) clearTimeout(timer); }

  function next() {
    clearTimer();
    prevIndex = current;
    if (current < slides.length - 1) current += 1; else if (loop) current = 0;
    gradientProgress.set(0, { duration: 0 });
    gradientProgress.set(1);
    startTimer();
  }
  function prev() {
    clearTimer();
    prevIndex = current;
    if (current > 0) current -= 1; else if (loop) current = slides.length - 1;
    gradientProgress.set(0, { duration: 0 });
    gradientProgress.set(1);
    startTimer();
  }
  function go(i: number) {
    if (i === current) return;
    clearTimer();
    prevIndex = current;
    current = i;
    gradientProgress.set(0, { duration: 0 });
    gradientProgress.set(1);
    startTimer();
  }

  function handleKey(e: KeyboardEvent) {
    if (e.key === 'ArrowRight') next();
    else if (e.key === 'ArrowLeft') prev();
  }

  let container: HTMLElement;
  let io: IntersectionObserver | null = null;
  let inView = true;
  onMount(() => {
    if (typeof window !== 'undefined') {
      reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    startTimer();
    window.addEventListener('keydown', handleKey);
    io = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting;
      if (!inView) clearTimer(); else startTimer();
    }, { threshold: 0.15 });
    if (container) io.observe(container);
  });
  function handlePointerDown(e: PointerEvent) {
    dragging = true; dragStartX = e.clientX; dragDelta = 0; clearTimer();
  }
  function handlePointerMove(e: PointerEvent) {
    if (!dragging) return; dragDelta = e.clientX - dragStartX;
  }
  function handlePointerUp() {
    if (!dragging) return; const threshold = 80; if (dragDelta > threshold) prev(); else if (dragDelta < -threshold) next(); else startTimer(); dragging = false; dragDelta = 0; }

  onDestroy(() => {
    clearTimer();
    window.removeEventListener('keydown', handleKey);
    if (io && container) io.disconnect();
  });
</script>

<div class="hero-slider" role="region" aria-label="Feature slider" bind:this={container}
  on:mouseenter={() => { if (pauseOnHover) { hovered = true; clearTimer(); } }}
  on:mouseleave={() => { if (pauseOnHover) { hovered = false; startTimer(); } }}
  on:pointerdown={handlePointerDown}
  on:pointermove={handlePointerMove}
  on:pointerup={handlePointerUp}
  on:pointerleave={handlePointerUp}
>
  <div class="gradients">
    {#each slides as s, i}
      <div class="grad-layer {i===current ? 'top' : i===prevIndex ? 'fading' : ''}" aria-hidden={i!==current}
        style={`--g:${s.gradient}; --alpha:${i===current?1: i===prevIndex? 1 - $gradientProgress : 0};`}></div>
    {/each}
  </div>

  <div class="slides" style={`--drag:${dragDelta}px;`}>
    {#each slides as slide, i}
      <article class="panel {i===current?'active':''}" aria-hidden={i!==current} style={`translate: calc(( ${i - current} * 100%) + var(--drag));`}>
        <div class="text">
          {#if i===current}
            <h1 class="t-title" transition:fade={{duration:reduceMotion?0:450}}>{slide.title}</h1>
            {#if slide.subtitle}<h2 class="t-sub" transition:fade={{duration:reduceMotion?0:550, delay:reduceMotion?0:90}}>{slide.subtitle}</h2>{/if}
            {#if slide.content}<p class="t-body" transition:fade={{duration:reduceMotion?0:550, delay:reduceMotion?0:160}}>{@html slide.content}</p>{/if}
          {/if}
        </div>
      </article>
    {/each}
  </div>

  {#if showArrows}
    <button class="nav prev" on:click={prev} aria-label="Previous slide">‹</button>
    <button class="nav next" on:click={next} aria-label="Next slide">›</button>
  {/if}

  {#if showIndicators}
    <div class="indicators">
      {#each slides as s, i}
        <button class:iActive={i===current} on:click={() => go(i)} aria-label={`Go to slide ${i+1}`}>
      <span class="dot"></span>
        </button>
      {/each}
    <div class="progress" style={`--p:${$progress};`}></div>
    </div>
  {/if}
  <div class="sr-only" aria-live="polite">Slide {current + 1} of {slides.length}: {slides[current].title}</div>
</div>

<style>
  .hero-slider { position:relative; width:100%; height:min(80vh,760px); overflow:hidden; border-radius:clamp(0px,2vw,28px); isolation:isolate; background:#000; touch-action: pan-y; }
  .gradients { position:absolute; inset:0; }
  .grad-layer { position:absolute; inset:0; background: var(--g,#000); opacity: var(--alpha,0); transition: opacity .7s ease; }
  .slides { position:absolute; inset:0; display:flex; align-items:center; justify-content:flex-start; overflow:hidden; }
  .panel { flex:0 0 100%; padding:clamp(1.5rem,4vw,4.5rem); display:flex; align-items:center; color:#fff; pointer-events:none; }
  .panel.active { pointer-events:auto; }
  .text { max-width:760px; }
  h1 { font-size:clamp(2.2rem,5vw,4.2rem); line-height:1.05; margin:0 0 .5rem; }
  h2 { font-size:clamp(1.2rem,2.5vw,1.8rem); font-weight:500; margin:0 0 1rem; opacity:.9; }
  p { font-size:clamp(.95rem,1.3vw,1.1rem); line-height:1.55; opacity:.85; }

  .nav { position:absolute; top:50%; translate:0 -50%; background:rgba(255,255,255,.15);color:#fff;border:none;width:48px;height:48px;border-radius:50%;display:grid;place-items:center;font-size:2rem;cursor:pointer;backdrop-filter: blur(4px); transition:.3s; }
  .nav:hover { background:rgba(255,255,255,.3); }
  .nav.prev { left: 1rem; }
  .nav.next { right: 1rem; }

  .indicators { position:absolute; left:50%; bottom:.75rem; translate:-50% 0; display:flex; gap:.4rem; align-items:center; background:rgba(0,0,0,.35); padding:.4rem .75rem; border-radius: 2rem; backdrop-filter: blur(6px); }
  .indicators button { all:unset; cursor:pointer; position:relative; }
  .indicators .dot { width:10px; height:10px; border-radius:50%; background:#777; display:block; transition:.35s; }
  .indicators button.iActive .dot { background:#fff; box-shadow:0 0 0 3px rgba(255,255,255,.25); }
  .indicators .progress { position:absolute; left:0; bottom:0; height:3px; background:linear-gradient(90deg,#fff,#aaa); width: calc(var(--p) * 100%); border-radius:3px; pointer-events:none; mix-blend-mode:screen; }

  @media (max-width:780px){
    .hero-slider { height:min(68vh,600px); border-radius:0; }
    .nav { width:40px; height:40px; font-size:1.5rem; }
    h1 { font-size:clamp(1.9rem,7vw,3rem); }
  }
  .sr-only { position:absolute; width:1px; height:1px; padding:0; margin:-1px; overflow:hidden; clip:rect(0 0 0 0); white-space:nowrap; border:0; }
</style>

