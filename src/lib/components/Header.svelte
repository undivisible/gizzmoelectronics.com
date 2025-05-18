  <header>
    <div class="logo-container">
      <h1>Gizzmo Electronics</h1>
      <p>We make your car <span>better.</span></p>
      
      <a href="https://www.facebook.com/gizzmoelectronics" class="social-icon" aria-label="Facebook">
        <img height="24" width="24" style="filter: brightness(0) invert(1);" src="https://cdn.jsdelivr.net/npm/simple-icons@v14/icons/facebook.svg" />
      </a>
    </div>
  </header>
  
  <style>
    header {
      padding: 2rem;
      position: fixed;
      z-index: 100;
    }
    
    .logo-container {
      display: flex;
      flex-direction: column;
    }
    
    h1 {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 700;
    }
    
    p {
      margin: 0;
      font-size: 1rem;
    }
    
    span {
      font-weight: 700;
    }
    
    .social-icon {
      margin-top: 0.5rem;
      color: #fff;
      opacity: 0.5;
      transition: opacity 0.3s ease-in-out;
    }

    .social-icon:hover {
      opacity: 1;
    }

    @media (max-width: 1650px) {
      header {
        position: relative;
      }
    }

    @media (max-height: 900px) {
      h1 {
        font-size: 1.5rem;
      }

      p {
        font-size: 0.9rem;
      }

      header {
        padding: 1rem;
      }
    }
  </style>