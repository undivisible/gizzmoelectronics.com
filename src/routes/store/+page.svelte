<script lang="ts">
  import { fade, fly } from 'svelte/transition';
  import { onMount } from 'svelte';
  import { addToCart, type Product, closeCart } from '$lib/stores/cart';
  import { Loader2 } from 'lucide-svelte';
  
  // Main product
  let mainProduct: Product = {
    id: 1,
    name: 'V4+',
    description: "It's a boost controller. It controls boost.",
    price: 340,
    image: '/images/v4.png'
  };
  
  // Additional products
  let additionalProducts: Product[] = [
    {
      id: 2,
      name: 'v4 wiring loom',
      price: 30,
      image: '/images/loom.png'
    },
    {
      id: 3,
      name: 'plugged MAC solenoid with tails',
      price: 80,
      image: '/images/solenoid.png'
    }
  ];
  
  let visible = false;
  let isProcessing = false;
  let error = '';
  
  onMount(() => {
    visible = true;
    // Ensure cart is closed when the home page loads
    closeCart();
  });
  
  async function handleBuyNow(): Promise<void> {
    isProcessing = true;
    error = '';
    
    try {
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: [{ ...mainProduct, quantity: 1 }],
          customerEmail: '', // You could add an email input field to collect this
        }),
      });
      
      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }
      
      if (data.url) {
        // Redirect to Stripe Checkout
        window.location.href = data.url;
      } else {
        throw new Error('No checkout URL returned');
      }
    } catch (err) {
      console.error('Checkout error:', err);
      error = err instanceof Error ? err.message : 'An error occurred during checkout';
      isProcessing = false;
    }
  }
  
  // Function to handle adding additional product to cart
  function handleAddAdditionalProduct(product: Product): void {
    addToCart(product);
  }
</script>

<svelte:head><title>Gizzmo Electronics</title></svelte:head>

<div class="flex justify-center items-center py-4">
  {#if visible}
    <div class="flex flex-col items-center max-w-xl w-full" in:fade={{ duration: 800 }}>
      <div class="flex flex-col md:flex-row md:items-center md:text-left text-center">
        <div class="w-full max-w-md mb-8 md:mb-0 md:mr-6">
          <img class="w-full h-auto" src={mainProduct.image || '/placeholder.svg'} alt={mainProduct.name} />
        </div>
        <div class="flex flex-col items-center md:items-start md:justify-center mt-2">
          <div class="text-center md:text-left mb-4">
            <h2 class="text-4xl md:text-5xl font-bold mb-2 m-0">{mainProduct.name}</h2>
            <p class="text-lg md:text-xl m-0">{mainProduct.description}</p>
          </div>
          <div class="text-4xl md:text-5xl font-bold mb-8">${mainProduct.price}</div>
        </div>
      </div>

      <div class="w-full mb-8 relative">
        <h3 class="text-base italic font-normal mb-4">you might also want</h3>
        <div class="grid grid-cols-1 sm:grid-cols-2 gap-8">
          {#each additionalProducts as product, i}
            <div
              class="group flex items-center p-3 rounded-lg bg-white/5 cursor-pointer transition-all relative overflow-hidden focus-visible:outline focus-visible:outline-2 focus-visible:outline-white hover:bg-white/10 hover:-translate-y-0.5 active:translate-y-0"
              in:fly={{ y: 20, delay: 300 + (i * 200), duration: 500 }}
              on:click={() => handleAddAdditionalProduct(product)}
              on:keydown={(e) => e.key === 'Enter' && handleAddAdditionalProduct(product)}
              tabindex="0"
              role="button"
              aria-label={`Add ${product.name} to cart`}
            >
              <div class="w-20 h-20 mr-4 shrink-0">
                <img class="w-full h-full object-cover" src={product.image || '/placeholder.svg?height=100&width=100'} alt={product.name} />
              </div>
              <div class="flex-1">
                <p class="m-0 mb-1 leading-tight">{product.name}</p>
                <p class="text-2xl font-bold m-0 group-hover:scale-[1.02] transition-transform">${product.price}</p>
              </div>
              <div class="absolute top-2 right-2 w-6 h-6 rounded-full bg-white/20 flex items-center justify-center font-bold group-hover:bg-white/30 transition-colors">+</div>
            </div>
          {/each}
        </div>
      </div>

      {#if error}
        <div class="text-red-400 mb-4 text-center">{error}</div>
      {/if}

      <div class="flex gap-4">
        <button on:click={handleBuyNow} disabled={isProcessing} class="inline-flex items-center rounded-full bg-white text-black font-medium px-6 py-3 text-sm hover:bg-neutral-200 transition disabled:opacity-70 disabled:cursor-not-allowed gap-2">
          {#if isProcessing}
            <Loader2 size={20} class="animate-spin" />
            Processing...
          {:else}
            buy now
          {/if}
        </button>
        <button on:click={() => addToCart(mainProduct)} disabled={isProcessing} class="inline-flex items-center rounded-full border border-white text-white font-medium px-6 py-3 text-sm hover:bg-white/10 transition disabled:opacity-70 disabled:cursor-not-allowed">add to cart</button>
      </div>
    </div>
  {/if}
</div>