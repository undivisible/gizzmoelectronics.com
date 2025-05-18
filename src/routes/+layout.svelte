<script lang="ts">
    import { fade } from 'svelte/transition';
    import { onMount, afterUpdate } from 'svelte';
    import Header from '$lib/components/Header.svelte';
    import Footer from '$lib/components/Footer.svelte';
    import CartSidebar from '$lib/components/CartSidebar.svelte';
    import CartButton from '$lib/components/CartButton.svelte';
    import { cart } from '$lib/stores/cart';
    import '../app.css';
    import { get } from 'svelte/store'; // Import get to access the value of cartOpen

  </script>
  
  <div class="app">
    <Header />
    <main>
      <slot />
      <CartButton />
      <CartSidebar />
    </main>
    <div class="gradient"></div>
    <Footer />
  </div>
  
  <style>
    .app {
      display: flex;
      flex-direction: column;
      min-height: 100vh;
    }
    
    main {
      flex: 1;
      padding: 5rem 2rem;
      max-width: 1200px;
      margin: 0 auto;
      width: 100%;
      scroll-behavior: smooth;
    }

    .gradient {
      position: sticky;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 200px;
      background-image: linear-gradient(to bottom, rgba(0, 0, 0, 0), rgb(0, 0, 0));
    }

    @media (max-width: 1650px) {
      main {
        padding: 0 2rem;
      }
    }

    @media (max-height: 900px) {
      main {
        padding: 0 1rem;
      }
    }
  </style>