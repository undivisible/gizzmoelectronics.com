<script lang="ts">
    import { page } from '$app/stores';
    
    // Function to check if a link is active
    function isActive(href: string): boolean {
      // For the home page, only match exact '/'
      if (href === '/') {
        return $page.url.pathname === '/';
      }
      // For other pages, check if the pathname starts with the href
      return $page.url.pathname.startsWith(href);
    }
  </script>
  
  <footer>
    <div class="footer-links">
      <a href="/support" class:active={isActive('/support')}>Contact</a>
      <a href="/" class:active={isActive('/')}>Downloads</a>
      <div>New products and store under development</div>
    </div>
  </footer>
    
  <style>
    footer {
      padding: 2rem;
      position: fixed;
      bottom: 0;
      left: 0;
      z-index: 10;
    }
  
    .footer-links {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }
  
    .footer-links a {
      color: #aaa;
      text-decoration: none;
      transition: color 0.2s, font-weight 0.2s;
      cursor: pointer;
    }

    .footer-links div {
      color: rgb(129, 129, 129);
      text-decoration: none;
      transition: color 0.2s, font-weight 0.2s;
      cursor: not-allowed;
    }
  
    .footer-links a:hover {
      color: #fff;
    }
    
    /* Active link styling */
    .footer-links a.active {
      color: #fff;
      font-weight: bold;
    }
  </style>