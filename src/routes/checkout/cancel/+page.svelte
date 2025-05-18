<script lang="ts">
    import { goto } from '$app/navigation';
    
    function goToCart() {
      // In a real app, you might want to open the cart sidebar
      goto('/');
    }
  </script>
  
  <div class="cancel-page">
    <div class="cancel-container">
      <h1>Order Cancelled</h1>
      <p>Your order has been cancelled and no payment has been processed.</p>
      <p>If you experienced any issues during checkout, please contact our support team.</p>
      
      <div class="actions">
        <button class="button" on:click={goToCart}>Return to Cart</button>
        <a href="/" class="button secondary">Continue Shopping</a>
      </div>
    </div>
  </div>
  
  <style>
    .cancel-page {
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 80vh;
      padding: 2rem;
    }
    
    .cancel-container {
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
      display: flex;
      gap: 1rem;
      justify-content: center;
    }
    
    .button {
      padding: 0.75rem 1.5rem;
      background-color: #fff;
      color: #000;
      text-decoration: none;
      border-radius: 2rem;
      font-weight: 500;
      transition: background-color 0.2s;
      border: none;
      cursor: pointer;
    }
    
    .button:hover {
      background-color: #eee;
    }
    
    .button.secondary {
      background-color: transparent;
      border: 1px solid #fff;
      color: #fff;
    }
    
    .button.secondary:hover {
      background-color: rgba(255, 255, 255, 0.1);
    }
  </style>