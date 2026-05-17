<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    
    let subject = '';
    let contents = '';
    
    function handleSubmit(): void {
      const mailtoLink = `mailto:sales@gizzmoelectronics.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(contents)}`;
      window.location.href = mailtoLink;
    }
    
    let visible = false;
    
    onMount(() => {
      visible = true;
    });
  </script>

  
  <div class="flex justify-center py-4 md:py-6">
    {#if visible}
      <div class="w-full max-w-xl" in:fade={{ duration: 800 }}>
        <div class="mb-8 md:mb-10">
          <h2 class="text-4xl md:text-5xl font-bold mb-2 leading-tight">Hey there! Looks like you need some assistance.</h2>
          <p class="text-lg md:text-xl text-neutral-300">Shoot us an email! You can also head over to our <a href="https://www.facebook.com/gizzmoelectronics" class="underline hover:decoration-wavy">facebook</a>.</p>
        </div>
        <form on:submit|preventDefault={handleSubmit} class="space-y-6">
          <div>
            <input type="text" id="subject" bind:value={subject} placeholder="subject" required class="w-full px-4 py-4 bg-transparent border border-white rounded-lg outline-none text-base md:text-lg placeholder:opacity-60 focus:border-neutral-300 transition" />
          </div>
          <div>
            <textarea id="contents" bind:value={contents} placeholder="contents" rows="10" required class="w-full px-4 py-4 bg-transparent border border-white rounded-lg outline-none text-base md:text-lg placeholder:opacity-60 focus:border-neutral-300 transition min-h-[12rem]"></textarea>
          </div>
          <button type="submit" class="inline-flex items-center px-8 py-3 rounded-full bg-white text-black font-medium text-sm md:text-base tracking-wide hover:bg-neutral-200 transition">send it!</button>
        </form>
      </div>
    {/if}
  </div>