<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import type { PageData } from './$types';
  import type { Manual } from './+page.server';
  
  export let data: PageData;
  
  let manuals: Manual[] = data.manuals || [];
  let categoryFilters: string[] = ['all'];
  let selectedCategory = 'all';
  let searchQuery = '';
  
  let filteredManuals: Manual[] = [];
  
  // Extract unique categories for filters
  $: {
    const uniqueCategories = new Set<string>();
    manuals.forEach(manual => {
      if (manual.category) {
        uniqueCategories.add(manual.category);
      }
    });
    categoryFilters = ['all', ...Array.from(uniqueCategories)];
  }
  
  // Filter manuals based on selected category and search query
  $: {
    filteredManuals = manuals.filter(manual => {
      const matchesCategory = selectedCategory === 'all' || manual.category === selectedCategory;
      const matchesSearch = searchQuery === '' || 
                           manual.title.toLowerCase().includes(searchQuery.toLowerCase());
      
      return matchesCategory && matchesSearch;
    });
  }
  
  let visible = false;
  
  onMount(() => {
    visible = true;
  });
</script>


<div class="py-4 md:py-6">
  {#if visible}
    <div class="w-full" in:fade={{ duration: 800 }}>
      <div class="mb-8">
        <h2 class="text-3xl md:text-4xl font-bold mb-4">Product Manuals</h2>
        <div class="flex flex-wrap items-center gap-4">
          {#each categoryFilters as filter}
            <button
              class="px-4 py-2 rounded-full border border-neutral-700 bg-neutral-900 text-white capitalize text-sm hover:bg-neutral-800 transition-colors data-[active=true]:bg-white data-[active=true]:text-black"
              data-active={selectedCategory === filter}
              on:click={() => selectedCategory = filter}
            >{filter}</button>
          {/each}
          <div class="relative flex-grow max-w-xs">
            <input
              type="text"
              placeholder="search"
              bind:value={searchQuery}
              class="w-full px-4 py-2 rounded-full bg-transparent border border-neutral-700 focus:border-white outline-none text-sm"
            />
          </div>
        </div>
      </div>
      {#if filteredManuals.length === 0}
        <div class="text-center py-16 text-neutral-400">
          <p>No manuals found matching your criteria</p>
        </div>
      {:else}
        <div class="grid gap-8" style="grid-template-columns:repeat(auto-fill,minmax(250px,1fr))">
          {#each filteredManuals as manual}
            <div class="flex flex-col bg-neutral-900 rounded-lg p-6 transition hover:-translate-y-1 hover:bg-neutral-800" in:fly={{ y: 20, duration: 500 }}>
              <div>
                <h3 class="text-lg font-semibold mb-2">{manual.title}</h3>
                <p class="text-neutral-400 capitalize text-xs mb-4">{manual.category}</p>
                <div class="flex flex-col gap-2">
                  {#if manual.files.quickstart}
                    <a href={manual.files.quickstart} target="_blank" rel="noopener noreferrer" class="flex items-center justify-between bg-neutral-800 hover:bg-neutral-700 rounded-md px-3 py-2 text-sm transition">
                      <span>quickstart guide</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>
                  {/if}
                  {#if manual.files.instructions}
                    <a href={manual.files.instructions} target="_blank" rel="noopener noreferrer" class="flex items-center justify-between bg-neutral-800 hover:bg-neutral-700 rounded-md px-3 py-2 text-sm transition">
                      <span>instruction manual</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="ml-2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>
                  {/if}
                </div>
              </div>
            </div>
          {/each}
        </div>
      {/if}
    </div>
  {/if}
</div>