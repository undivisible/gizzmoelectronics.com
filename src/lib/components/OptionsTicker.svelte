<script lang="ts">
  export let items: string[] = [
    'Closed Loop', 'CO2 Ready', '4D Mapping', 'Traction Assist', 'Launch Strategy', 'Gear Based Control', 'Atmospheric Comp', 'Failsafe Logic'
  ];
  export let speed = 36; // seconds for one full loop
  // Duplicate list for seamless loop
  $: loopItems = [...items, ...items];
</script>

<div class="ticker" role="marquee" aria-label="Feature options scrolling">
  <div class="track" style={`--duration:${speed}s`}>
    {#each loopItems as it, i}
      <span class="chip" aria-hidden={i>=items.length}>{it}</span>
    {/each}
  </div>
</div>

<style>
  .ticker { width:100%; overflow:hidden; position:relative; padding:.65rem 0; mask:linear-gradient(90deg,transparent, #000 8%, #000 92%, transparent); }
  .track { display:flex; gap:.85rem; width:fit-content; animation: slide var(--duration) linear infinite; }
  .chip { flex:0 0 auto; background:linear-gradient(135deg,#ffffff0d,#ffffff22); color:#fff; padding:.55rem .95rem; font-size:.8rem; border:1px solid #ffffff1a; border-radius:999px; letter-spacing:.5px; backdrop-filter: blur(4px) saturate(1.4); position:relative; }
  .chip::after { content:""; position:absolute; inset:0; border-radius:inherit; box-shadow:0 0 0 1px #ffffff08,0 0 12px -4px #fff inset; pointer-events:none; }
  @keyframes slide { from { transform:translateX(0);} to { transform:translateX(-50%);} }
  @media (prefers-reduced-motion: reduce){ .track { animation:none; } }
</style>
