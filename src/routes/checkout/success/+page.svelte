<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { cart } from '$lib/stores/cart';
    
    let orderId = '';
    let loading = true;
    
    onMount(async () => {
      // Get the session ID from the URL
      const url = new URL(window.location.href);
      const sessionId = url.searchParams.get('session_id');
      
      if (sessionId) {
        try {
          // In a real app, you would verify the session with your server
          // For now, we'll just simulate a successful order
          orderId = `order_${Date.now()}`;
          
          // Clear the cart
          cart.clearCart();
          
          loading = false;
        } catch (error) {
          console.error('Error verifying session:', error);
          loading = false;
        }
      } else {
        // No session ID, redirect to home
        goto('/');
      }
    });
  </script>
  
  <div class="flex items-center justify-center min-h-[80vh] p-8">
    {#if loading}
      <div class="text-center max-w-xl">
        <p class="text-lg">Processing your order...</p>
      </div>
    {:else}
      <div class="text-center max-w-xl">
        <h1 class="text-3xl font-bold mb-4">Thank You for Your Order!</h1>
        <p class="mb-4 text-lg">Your order has been successfully processed.</p>
        <p class="mb-4 text-lg">Order ID: <strong>{orderId}</strong></p>
        <p class="mb-8 text-lg">We've sent a confirmation email with your order details.</p>
        <div class="mt-6">
          <a href="/" class="inline-block px-6 py-3 bg-white text-black rounded-full font-medium hover:bg-neutral-200 transition">Continue Shopping</a>
        </div>
      </div>
    {/if}
  </div>