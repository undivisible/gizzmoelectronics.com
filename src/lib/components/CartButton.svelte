<script lang="ts">
    import { cart, toggleCart } from '$lib/stores/cart';
    import { ShoppingCart } from 'lucide-svelte';
    import { derived } from 'svelte/store';
    
    // Calculate total items in cart
    const itemCount = derived(cart, ($cart) => $cart.items.reduce((sum, item) => sum + item.quantity, 0));
  </script>
  
  <button 
    class="cart-button" 
    on:click={toggleCart}
    aria-label={$itemCount > 0 ? `Open cart with {$itemCount} items` : 'Open cart'}
  >
    <ShoppingCart size={24} />
    {#if $itemCount > 0}
      <span class="item-count">{$itemCount}</span>
    {/if}
  </button>
  
  <style>
    .cart-button {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      width: 56px;
      height: 56px;
      border-radius: 50%;
      background-color: #fff;
      color: #000;
      border: none;
      display: flex;
      align-items: center;
      justify-content: center;
      cursor: pointer;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
      z-index: 997;
      transition: transform 0.2s, background-color 0.2s;
    }
    
    .cart-button:hover {
      background-color: #eee;
      transform: scale(1.05);
    }
    
    .cart-button:active {
      transform: scale(0.95);
    }
    
    .item-count {
      position: absolute;
      top: -5px;
      right: -5px;
      background-color: #ff4d4d;
      color: white;
      font-size: 0.75rem;
      font-weight: bold;
      min-width: 20px;
      height: 20px;
      border-radius: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 0 6px;
    }
  </style>