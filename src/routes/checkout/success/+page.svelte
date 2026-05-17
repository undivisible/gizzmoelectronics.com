<script lang="ts">
  import { onMount } from 'svelte';
  import { goto } from '$app/navigation';

  let orderId = '';
  let loading = true;

  onMount(() => {
    const url = new URL(window.location.href);
    const sessionId = url.searchParams.get('session_id');

    if (sessionId) {
      orderId = sessionId;
      loading = false;
      return;
    }

    goto('/');
  });
</script>

<div class="flex items-center justify-center min-h-[80vh] p-8">
  {#if loading}
    <div class="text-center max-w-xl">
      <p class="text-lg">Processing your order…</p>
    </div>
  {:else}
    <div class="text-center max-w-xl">
      <h1 class="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
      <p class="mb-4 text-lg">Your payment was received and your order is confirmed.</p>
      <p class="mb-8 text-lg">Reference: <strong>{orderId}</strong></p>
      <a
        href="/"
        class="inline-block px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-neutral-200 transition"
      >Back to B1</a>
    </div>
  {/if}
</div>
