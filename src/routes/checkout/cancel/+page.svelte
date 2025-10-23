<script lang="ts">
    import { goto } from '$app/navigation';
    
    function goToCart() {
      // In a real app, you might want to open the cart sidebar
      goto('/');
    }
  </script>
  
  <div class="flex items-center justify-center min-h-[80vh] p-8">
    <div class="text-center max-w-xl">
      <h1 class="text-4xl font-bold mb-4">Order Cancelled</h1>
      <p class="mb-4 text-lg">Your order has been cancelled and no payment has been processed.</p>
      <p class="mb-4 text-lg">If you experienced any issues during checkout, please contact our support team.</p>
      <div class="mt-8 flex flex-wrap gap-4 justify-center">
        <button on:click={goToCart} class="inline-flex items-center rounded-full bg-white text-black font-medium px-6 py-3 text-sm hover:bg-neutral-200 transition disabled:opacity-70 disabled:cursor-not-allowed">Return to Cart</button>
        <a href="/" class="inline-flex items-center rounded-full border border-white text-white font-medium px-6 py-3 text-sm hover:bg-white/10 transition">Continue Shopping</a>
      </div>
    </div>
  </div>