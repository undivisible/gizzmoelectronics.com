<script lang="ts">
  import { cart, removeFromCart, updateQuantity, closeCart } from '$lib/stores/cart';
  import { fly, fade } from 'svelte/transition';
  import { X, Trash2, Plus, Minus, ShoppingCart } from 'lucide-svelte';
  import { derived } from 'svelte/store';
  import { get } from 'svelte/store'; // Import get to access the value of the store

  // Calculate total price
  const totalPrice = derived(cart, ($cart) => $cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0));

  // Check if cart is empty
  const isEmpty = derived(cart, ($cart) => $cart.items.length === 0);

  // Handle checkout
  async function handleCheckout() {
    try {
      const $cart = get(cart); // Access the value of the cart store
      const response = await fetch('/api/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items: $cart.items,
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
      alert(err instanceof Error ? err.message : 'An error occurred during checkout');
    }
  }
</script>

{#if $cart.isOpen}
  <div 
    class="cart-overlay" 
    on:click={closeCart} 
    on:keydown={(e) => e.key === 'Escape' && closeCart()}
    transition:fade={{ duration: 300 }}
  ></div>
  
  <div 
    class="cart-sidebar"
    transition:fly={{ x: 300, duration: 300 }}
  >
    <div class="cart-header">
      <h2>Your Cart</h2>
      <button class="close-button" on:click={closeCart} aria-label="Close cart">
        <X size={24} />
      </button>
    </div>
    
    {#if $isEmpty}
      <div class="empty-cart">
        <ShoppingCart size={64} />
        <p>Your cart is empty</p>
      </div>
    {:else}
      <div class="cart-items">
        {#each $cart.items as item}
          <div class="cart-item">
            <div class="item-image">
              {#if item.image}
                <img src={item.image || "/placeholder.svg"} alt={item.name} />
              {:else}
                <div class="placeholder-image"></div>
              {/if}
            </div>
            
            <div class="item-details">
              <h3>{item.name}</h3>
              <p class="item-price">${item.price}</p>
              
              <div class="quantity-controls">
                <button 
                  class="quantity-button"
                  on:click={() => updateQuantity(item.id, item.quantity - 1)}
                  aria-label="Decrease quantity"
                  disabled={item.quantity <= 1}
                >
                  <Minus size={16} />
                </button>
                
                <span class="quantity">{item.quantity}</span>
                
                <button 
                  class="quantity-button"
                  on:click={() => updateQuantity(item.id, item.quantity + 1)}
                  aria-label="Increase quantity"
                >
                  <Plus size={16} />
                </button>
                
                <button 
                  class="remove-button"
                  on:click={() => removeFromCart(item.id)}
                  aria-label={`Remove ${item.name} from cart`}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        {/each}
      </div>
      
      <div class="cart-footer">
        <div class="cart-total">
          <span>Total:</span>
          <span class="total-price">${$totalPrice.toFixed(2)}</span>
        </div>
        
        <button class="checkout-button" on:click={handleCheckout}>
          Checkout
        </button>
      </div>
    {/if}
  </div>
{/if}

<style>
  .cart-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 998;
  }
  
  .cart-sidebar {
    position: fixed;
    top: 0;
    right: 0;
    width: 300px;
    height: 100vh;
    background-color: #222;
    z-index: 999;
    display: flex;
    flex-direction: column;
    box-shadow: -2px 0 10px rgba(0, 0, 0, 0.3);
  }
  
  .cart-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 1rem;
    border-bottom: 1px solid #333;
  }
  
  .cart-header h2 {
    margin: 0;
    font-size: 1.5rem;
  }
  
  .close-button {
    background: none;
    border: none;
    color: #fff;
    cursor: pointer;
    padding: 0.25rem;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    transition: background-color 0.2s;
  }
  
  .close-button:hover {
    background-color: rgba(255, 255, 255, 0.1);
  }
  
  .empty-cart {
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    color: #888;
    padding: 2rem;
    text-align: center;
  }
  
  .empty-cart p {
    margin-top: 1rem;
    font-size: 1.1rem;
  }
  
  .cart-items {
    flex: 1;
    overflow-y: auto;
    padding: 1rem;
  }
  
  .cart-item {
    display: flex;
    margin-bottom: 1.5rem;
    padding-bottom: 1.5rem;
    border-bottom: 1px solid #333;
  }
  
  .cart-item:last-child {
    margin-bottom: 0;
    padding-bottom: 0;
    border-bottom: none;
  }
  
  .item-image {
    width: 70px;
    height: 70px;
    margin-right: 1rem;
    background-color: #333;
    border-radius: 4px;
    overflow: hidden;
  }
  
  .item-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  
  .placeholder-image {
    width: 100%;
    height: 100%;
    background-color: #333;
  }
  
  .item-details {
    flex: 1;
  }
  
  .item-details h3 {
    margin: 0 0 0.25rem 0;
    font-size: 1rem;
  }
  
  .item-price {
    margin: 0 0 0.5rem 0;
    font-weight: bold;
    font-size: 1.1rem;
  }
  
  .quantity-controls {
    display: flex;
    align-items: center;
  }
  
  .quantity-button {
    background-color: #333;
    border: none;
    color: #fff;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .quantity-button:hover:not(:disabled) {
    background-color: #444;
  }
  
  .quantity-button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
  
  .quantity {
    margin: 0 0.5rem;
    min-width: 24px;
    text-align: center;
  }
  
  .remove-button {
    background-color: #333;
    border: none;
    color: #ff4d4d;
    width: 24px;
    height: 24px;
    border-radius: 4px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-left: auto;
    transition: background-color 0.2s;
  }
  
  .remove-button:hover {
    background-color: #444;
  }
  
  .cart-footer {
    padding: 1rem;
    border-top: 1px solid #333;
  }
  
  .cart-total {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    font-size: 1.1rem;
  }
  
  .total-price {
    font-weight: bold;
    font-size: 1.5rem;
  }
  
  .checkout-button {
    width: 100%;
    padding: 0.75rem;
    background-color: #fff;
    color: #000;
    border: none;
    border-radius: 2rem;
    font-weight: 500;
    cursor: pointer;
    transition: background-color 0.2s;
  }
  
  .checkout-button:hover {
    background-color: #eee;
  }
</style>