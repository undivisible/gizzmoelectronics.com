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

<head><title>Gizzmo Electronics</title></head>

<div class="product-page">
  {#if visible}
    <div class="product-container" in:fade={{ duration: 800 }}>
      <div class="in-case">        
        <div class="product-image">
          <img src={mainProduct.image || "/placeholder.svg"} alt={mainProduct.name} />
        </div>
        <div class="in-case-text">
          <div class="product-info">
            <h2 class="product-name">{mainProduct.name}</h2>
            <p class="product-description">{mainProduct.description}</p>
          </div>
          <div class="product-price">${mainProduct.price}</div>
        </div>
      </div>
      
      <div class="additional-products">
        <h3>you might also want</h3>
        
        <div class="additional-products-grid">
          {#each additionalProducts as product, i}
            <div 
              class="additional-product" 
              in:fly={{ y: 20, delay: 300 + (i * 200), duration: 500 }}
              on:click={() => handleAddAdditionalProduct(product)}
              on:keydown={(e) => e.key === 'Enter' && handleAddAdditionalProduct(product)}
              tabindex="0"
              role="button"
              aria-label={`Add ${product.name} to cart`}
            >
              <div class="additional-product-image">
                <img src={product.image || "/placeholder.svg?height=100&width=100"} alt={product.name} />
              </div>
              <div class="additional-product-info">
                <p class="additional-product-name">{product.name}</p>
                <p class="additional-product-price">${product.price}</p>
              </div>
              <div class="add-icon">+</div>
            </div>
          {/each}
        </div>
      </div>
      
      {#if error}
        <div class="error-message">
          {error}
        </div>
      {/if}
      
      <div class="product-actions">
        <button class="buy-now" on:click={handleBuyNow} disabled={isProcessing}>
          {#if isProcessing}
            <Loader2 size={20} class="spinner" />
            Processing...
          {:else}
            buy now
          {/if}
        </button>
        <button class="add-to-cart" on:click={() => addToCart(mainProduct)} disabled={isProcessing}>
          add to cart
        </button>
      </div>
    </div>
  {/if}
</div>

<style>
  .product-page {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 1rem 0;
  }
  
  .product-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 600px;
    width: 100%;
  }
  
  .product-image {
    margin-bottom: 2rem;
    width: 100%;
    max-width: 400px;
  }
  
  .product-image img {
    width: 100%;
    height: auto;
  }
  
  .product-info {
    text-align: center;
    margin-bottom: 1rem;
  }
  
  .product-name {
    font-size: 2.5rem;
    margin: 0 0 0.5rem 0;
  }
  
  .product-description {
    font-size: 1.25rem;
    margin: 0;
  }
  
  .product-price {
    font-size: 2.5rem;
    font-weight: 700;
    margin-bottom: 2rem;
  }
  
  .additional-products {
    width: 100%;
    margin-bottom: 2rem;
    position: relative;
  }
  
  .additional-products h3 {
    font-size: 1.25rem;
    margin-bottom: 1rem;
    font-weight: normal;
    font-style: italic;
  }
  
  .additional-products-grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 2rem;
  }
  
  .additional-product {
    display: flex;
    align-items: center;
    padding: 0.75rem;
    border-radius: 8px;
    background-color: rgba(255, 255, 255, 0.05);
    cursor: pointer;
    transition: all 0.2s ease;
    position: relative;
    overflow: hidden;
  }
  
  .additional-product:hover {
    background-color: rgba(255, 255, 255, 0.1);
    transform: translateY(-2px);
  }
  
  .additional-product:active {
    transform: translateY(0);
  }
  
  .additional-product:focus-visible {
    outline: 2px solid white;
    outline-offset: 2px;
  }
  
  .additional-product-image {
    width: 80px;
    height: 80px;
    margin-right: 1rem;
    flex-shrink: 0;
  }
  
  .additional-product-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .additional-product-info {
    flex: 1;
  }
  
  .additional-product-name {
    margin: 0 0 0.25rem 0;
  }
  
  .additional-product-price {
    font-size: 2rem;
    font-weight: 700;
    margin: 0;
  }
  
  .add-icon {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 24px;
    height: 24px;
    background-color: rgba(255, 255, 255, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;
    transition: background-color 0.2s;
  }
  
  .additional-product:hover .add-icon {
    background-color: rgba(255, 255, 255, 0.3);
  }
  
  .error-message {
    color: #ff4d4d;
    margin-bottom: 1rem;
    text-align: center;
  }
  
  .product-actions {
    display: flex;
    gap: 1rem;
  }
  
  .buy-now, .add-to-cart {
    padding: 0.75rem 1.5rem;
    border-radius: 2rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
    border: 1px solid #fff;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
  
  .buy-now {
    background-color: #fff;
    color: #000;
  }
  
  .buy-now:hover:not(:disabled) {
    background-color: #eee;
  }
  
  .add-to-cart {
    background-color: transparent;
    color: #fff;
  }
  
  .add-to-cart:hover:not(:disabled) {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .buy-now:disabled, .add-to-cart:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
  
  .spinner {
    animation: spin 1s linear infinite;
  }

  .in-case {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .in-case-text {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    margin-top: 1rem;
  }
  
  @keyframes spin {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }

  @media (max-width: 768px) {
    .additional-products-grid {
      grid-template-columns: 1fr;
    }
    
    .product-image {
      width: 75%;
    }

    .in-case {
      flex-direction: row;
    }

    .in-case-text {
      margin-left: 1rem;
      align-items: flex-start;
    }

    .product-info {
      text-align: left;
    }

    .product-page {
      padding: 0;
      height: auto;
      justify-content: flex-start;
      align-items: flex-start;
    }

    .additional-products-grid {
        gap: 0;
    }

    h3 {
      margin-block-start: 0;
    }
  }

  @media (max-height: 900px) {
    .product-name {
      font-size: 2rem;
    }

   .product-description {
      font-size: 1rem;
    }

   .product-price {
      font-size: 2rem;
    }

    .additional-product-price {
      font-size: 1.5rem;
    }

    .additional-products h3 {
      font-size: 1rem;
    }

    .additional-products {
      margin-bottom: 1rem;
    }
  }
</style>