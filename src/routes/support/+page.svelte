<script lang="ts">
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    
    let subject = '';
    let contents = '';
    
    function handleSubmit(): void {
      const mailtoLink = `mailto:sales@gizzmoelectronics.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(contents)}`;
      window.location.href = mailtoLink;
    }
    
    let visible = false;
    
    onMount(() => {
      visible = true;
    });
  </script>

  <head><title>Support | Gizzmo Electronics</title></head>
  
  <div class="support-page">
    {#if visible}
      <div class="support-container" in:fade={{ duration: 800 }}>
        <div class="support-header">
          <h2>Hey there! Looks like you need some assistance.</h2>
          <p>Shoot us an email! You can also head over to our <a href="https://www.facebook.com/gizzmoelectronics">facebook</a>.</p>
        </div>
        
        <form on:submit|preventDefault={handleSubmit} class="support-form">
          <div class="form-group">
            <input 
              type="text" 
              id="subject" 
              bind:value={subject} 
              placeholder="subject"
              required
            />
          </div>
          
          <div class="form-group">
            <textarea 
              id="contents" 
              bind:value={contents} 
              placeholder="contents"
              rows="10"
              required
            ></textarea>
          </div>
          
          <button type="submit" class="send-button">
            send it!
          </button>
        </form>
      </div>
    {/if}
  </div>
  
  <style>
    .support-page {
      display: flex;
      justify-content: center;
      padding: 1rem 0;
    }
    
    .support-container {
      max-width: 600px;
      width: 100%;
    }
    
    .support-header {
      margin-bottom: 2rem;
    }
    
    .support-header h2 {
      font-size: 2.5rem;
      margin-bottom: 0.5rem;
    }
    
    .support-header p {
      font-size: 1.25rem;
    }
    
    .support-header a {
      color: #fff;
      text-decoration: underline;
    }

    .support-header a:hover {
      text-decoration: wavy;
    }
    
    .support-form {
      width: 100%;
    }
    
    .form-group {
      margin-bottom: 1.5rem;
    }
    
    input, textarea {
      width: 100%;
      padding: 1rem;
      background-color: transparent;
      color: #fff;
      border: 1px solid #fff;
      border-radius: 0.5rem;
      outline: none;
      font-size: 1rem;
    }
    
    .send-button {
      padding: 0.75rem 1.5rem;
      background-color: #fff;
      color: #000;
      border: none;
      border-radius: 2rem;
      font-weight: 500;
      cursor: pointer;
      transition: background-color 0.2s;
    }
    
    .send-button:hover {
      background-color: #eee;
    }

    @media (max-width: 768px) {
      .support-page {
        padding: 0;
      }

      h2 {
        margin-block-start: 0;
      }

      .support-header h2 {
        font-size: 2rem;
      }
      
      textarea {
        height: 10rem;
      }
    }

    @media (max-height: 900px) {
      .support-header h2 {
        font-size: 1.5rem;
      }
      
      .support-header p {
        font-size: 1rem;
      }

     .send-button {
        padding: 0.5rem 1rem;
      }

      .support-header {
        margin-bottom: 1rem;
      }
    }
  </style>