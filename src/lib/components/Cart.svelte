<script lang="ts">
    import { X, Trash2, Loader2 } from 'lucide-svelte';
    import { cartItems, cartOpen, updateQuantity, removeFromCart, closeCart } from '$lib/stores/cart';
    import { derived } from 'svelte/store';
    import { get } from 'svelte/store'; // Import get to access the value of cartItems
    
    const total = derived(cartItems, ($cartItems) => 
      $cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    );
    
    let isProcessing = false;
    let error = '';
    
    async function handleCheckout(): Promise<void> {
      const $cartItems = get(cartItems); // Use get to access the value of cartItems
      if ($cartItems.length === 0) {
        error = 'Your cart is empty';
        return;
      }
      
      isProcessing = true;
      error = '';
      
      try {
        const response = await fetch('/api/create-checkout-session', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            items: $cartItems,
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
  </script>
  
  <div class="cart">
    <div class="cart-header">
      <h2>Your Cart</h2>
      <button class="close-button" on:click={() => closeCart()}>
        <X size={20} />
      </button>
    </div>
    
    {#if $cartItems.length === 0}
      <div class="empty-cart">
        <p>Your cart is empty</p>
      </div>
    {:else}
      <div class="cart-items">
        {#each $cartItems as item}
          <div class="cart-item">
            <img src={item.image || "/placeholder.svg?height=60&width=60"} alt={item.name} />
            <div class="item-details">
              <h3>{item.name}</h3>
              <p class="item-price">${item.price}</p>
              
              <div class="quantity-controls">
                <button 
                  on:click={() => updateQuantity(item.id, item.quantity - 1)}
                  aria-label="Decrease quantity"
                  disabled={isProcessing}
                >-</button>
                <span>{item.quantity}</span>
                <button 
                  on:click={() => updateQuantity(item.id, item.quantity + 1)}
                  aria-label="Increase quantity"
                  disabled={isProcessing}
                >+</button>
              </div>
            </div>
            
            <button 
              class="remove-button" 
              on:click={() => removeFromCart(item.id)}
              aria-label="Remove item"
              disabled={isProcessing}
            >
              <Trash2 size={16} />
            </button>
          </div>
        {/each}
      </div>
      
      <div class="cart-footer">
        <div class="cart-total">
          <span>Total:</span>
          <span>${$total.toFixed(2)}</span>
        </div>
        
        {#if error}
          <div class="error-message">
            {error}
          </div>
        {/if}
        
        <button 
          class="checkout-button" 
          on:click={handleCheckout}
          disabled={isProcessing || $cartItems.length === 0}
        >
          {#if isProcessing}
            <Loader2 size={20} class="spinner" />
            Processing...
          {:else}
            Checkout with Stripe
          {/if}
        </button>
      </div>
    {/if}
  </div>
  
  <style>
    .cart {
      padding: 1.5rem;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    
    .cart-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 1.5rem;
    }
    
    h2 {
      margin: 0;
      font-size: 1.25rem;
    }
    
    .close-button {
      background: none;
      border: none;
      color: #aaa;
      cursor: pointer;
      padding: 0.25rem;
      transition: color 0.2s;
    }
    
    .close-button:hover {
      color: #fff;
    }
    
    .empty-cart {
      flex: 1;
      display: flex;
      align-items: center;
      justify-content: center;
      color: #aaa;
    }
    
    .cart-items {
      flex: 1;
      overflow-y: auto;
    }
    
    .cart-item {
      display: flex;
      padding: 1rem 0;
      border-bottom: 1px solid #333;
      position: relative;
    }
    
    .cart-item img {
      width: 60px;
      height: 60px;
      object-fit: cover;
      margin-right: 1rem;
    }
    
    .item-details {
      flex: 1;
    }
    
    .item-details h3 {
      margin: 0 0 0.25rem 0;
      font-size: 0.875rem;
    }
    
    .item-price {
      margin: 0 0 0.5rem 0;
      color: #aaa;
      font-size: 0.875rem;
    }
    
    .quantity-controls {
      display: flex;
      align-items: center;
      gap: 0.5rem;
    }
    
    .quantity-controls button {
      width: 24px;
      height: 24px;
      background-color: #333;
      border: none;
      color: #fff;
      border-radius: 4px;
      cursor: pointer;
      display: flex;
      align-items: center;
      justify-content: center;
      transition: background-color 0.2s;
    }
    
    .quantity-controls button:hover:not(:disabled) {
      background-color: #444;
    }
    
    .quantity-controls button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .remove-button {
      background: none;
      border: none;
      color: #666;
      cursor: pointer;
      padding: 0.25rem;
      transition: color 0.2s;
      position: absolute;
      top: 1rem;
      right: 0;
    }
    
    .remove-button:hover:not(:disabled) {
      color: #ff4d4d;
    }
    
    .remove-button:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }
    
    .cart-footer {
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #333;
    }
    
    .cart-total {
      display: flex;
      justify-content: space-between;
      margin-bottom: 1rem;
      font-weight: 600;
    }
    
    .error-message {
      color: #ff4d4d;
      margin-bottom: 1rem;
      font-size: 0.875rem;
      text-align: center;
    }
    
    .checkout-button {
      width: 100%;
      padding: 0.75rem;
      background-color: #fff;
      color: #000;
      border: none;
      border-radius: 2rem;
      font-weight: 600;
      cursor: pointer;
      transition: background-color 0.2s;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 0.5rem;
    }
    
    .checkout-button:hover:not(:disabled) {
      background-color: #eee;
    }
    
    .checkout-button:disabled {
      opacity: 0.7;
      cursor: not-allowed;
    }
    
    .spinner {
      animation: spin 1s linear infinite;
    }
    
    @keyframes spin {
      from {
        transform: rotate(0deg);
      }
      to {
        transform: rotate(360deg);
      }
    }
  </style>