<script lang="ts">
  import { onMount } from 'svelte';
  import { fade, fly } from 'svelte/transition';
  import type { PageData } from './manuals/$types';
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

<head><title>Downloads | Gizzmo Electronics</title></head>

<div class="manuals-page">
  {#if visible}
    <div class="manuals-container" in:fade={{ duration: 800 }}>
      <div class="manuals-header">
        <h2>Product Manuals</h2>
        
        <div class="filter-buttons">
          {#each categoryFilters as filter}
            <button 
              class="filter-button" 
              class:active={selectedCategory === filter}
              on:click={() => selectedCategory = filter}
            >
              {filter}
            </button>
          {/each}
          
          <div class="search-container">
            <input 
              type="text" 
              placeholder="search" 
              bind:value={searchQuery}
              class="search-input"
            />
          </div>
        </div>
      </div>
      
      {#if filteredManuals.length === 0}
        <div class="no-manuals">
          <p>No manuals found matching your criteria</p>
        </div>
      {:else}
        <div class="manuals-grid">
          {#each filteredManuals as manual}
            <div class="manual-item" in:fly={{ y: 20, duration: 500 }}>
              <div class="manual-info">
                <h3>{manual.title}</h3>
                <p class="manual-category">{manual.category}</p>
                <div class="manual-links">
                  {#if manual.files.quickstart}
                    <a href={manual.files.quickstart} target="_blank" rel="noopener noreferrer">
                      <span>quickstart guide</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
                    </a>
                  {/if}
                  {#if manual.files.instructions}
                    <a href={manual.files.instructions} target="_blank" rel="noopener noreferrer">
                      <span>instruction manual</span>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="icon"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
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

<style>
  .manuals-page {
    padding: 1rem 0;
  }
  
  .manuals-container {
    width: 100%;
  }
  
  .manuals-header {
    margin-bottom: 2rem;
  }
  
  .manuals-header h2 {
    font-size: 2rem;
    margin-bottom: 1rem;
  }
  
  .filter-buttons {
    display: flex;
    gap: 1rem;
    align-items: center;
    flex-wrap: wrap;
  }
  
  .filter-button {
    padding: 0.5rem 1rem;
    background-color: #111;
    color: #fff;
    border: 1px solid #333;
    border-radius: 2rem;
    cursor: pointer;
    transition: all 0.2s;
    text-transform: capitalize;
  }
  
  .filter-button.active {
    background-color: #fff;
    color: #000;
  }

  .filter-button:hover {
    background-color: #333;
    color: #fff;
  }
  
  .search-container {
    position: relative;
    flex-grow: 1;
    max-width: 300px;
  }
  
  .search-input {
    width: 100%;
    padding: 0.5rem 1rem;
    background-color: transparent;
    color: #fff;
    border: 1px solid #333;
    border-radius: 2rem;
    outline: none;
    transition: border-color 0.3s;
  }

  .search-input:focus {
    border: 1px solid #fff;
  }
  
  .manuals-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: 2rem;
  }
  
  .manual-item {
    display: flex;
    flex-direction: column;
    background-color: #111;
    border-radius: 8px;
    overflow: hidden;
    transition: transform 0.3s, background-color 0.3s;
    padding: 1.5rem;
  }
  
  .manual-item:hover {
    background-color: #222;
    transform: translateY(-5px);
  }
  
  .manual-info h3 {
    font-size: 1.25rem;
    margin-bottom: 0.5rem;
  }
  
  .manual-category {
    color: #aaa;
    margin-bottom: 1rem;
    font-size: 0.9rem;
    text-transform: capitalize;
  }
  
  .manual-links {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .manual-links a {
    color: #fff;
    text-decoration: none;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0.5rem 0.75rem;
    background-color: #222;
    border-radius: 4px;
    transition: background-color 0.2s;
  }
  
  .manual-links a:hover {
    background-color: #333;
  }
  
  .manual-links a .icon {
    margin-left: 0.5rem;
  }
  
  .no-manuals {
    text-align: center;
    padding: 4rem 0;
    color: #aaa;
  }

  @media (max-width: 768px) {
      .manuals-page {
        padding: 0;
      }

      h2 {
        margin-block-start: 0;
      }

      .manuals-header h2 {
        font-size: 2rem;
      }
    }
</style>