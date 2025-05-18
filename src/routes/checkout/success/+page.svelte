<script lang="ts">
    import { onMount } from 'svelte';
    import { goto } from '$app/navigation';
    import { cartItems } from '$lib/stores/cart';
    
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
          cartItems.set([]);
          
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
  
  <div class="success-page">
    {#if loading}
      <div class="loading">
        <p>Processing your order...</p>
      </div>
    {:else}
      <div class="success-container">
        <h1>Thank You for Your Order!</h1>
        <p>Your order has been successfully processed.</p>
        <p>Order ID: <strong>{orderId}</strong></p>
        <p>We've sent a confirmation email with your order details.</p>
        
        <div class="actions">
          <a href="/" class="button">Continue Shopping</a>
        </div>
      </div>
    {/if}
  </div>
  
  <style>
    .success-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 2rem;
    }
    
    .loading, .success-container {
      text-align: center;
      max-width: 600px;
    }
    
    h1 {
      font-size: 2rem;
      margin-bottom: 1rem;
    }
    
    p {
      margin-bottom: 1rem;
      font-size: 1.1rem;
    }
    
    .actions {
      margin-top: 2rem;
    }
    
    .button {
      display: inline-block;
      padding: 0.75rem 1.5rem;
      background-color: #fff;
      color: #000;
      text-decoration: none;
      border-radius: 2rem;
      font-weight: 500;
      transition: background-color 0.2s;
    }
    
    .button:hover {
      background-color: #eee;
    }
  </style>