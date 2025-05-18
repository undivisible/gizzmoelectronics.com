import { writable } from 'svelte/store';

export interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  image?: string;
  quantity?: number;
}

export interface CartItem extends Product {
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
}

function createCartStore() {
  const { subscribe, update } = writable<CartStore>({
    items: [],
    isOpen: false
  });

  return {
    subscribe,
    addToCart: (product: Product) => {
      update(cart => {
        const existingItem = cart.items.find(item => item.id === product.id);
        
        if (existingItem) {
          // Increase quantity if item already exists
          existingItem.quantity += 1;
          return { ...cart, isOpen: true };
        } else {
          // Add new item with quantity 1
          return {
            ...cart,
            items: [...cart.items, { ...product, quantity: 1 }],
            isOpen: true
          };
        }
      });
    },
    removeFromCart: (productId: number) => {
      update(cart => ({
        ...cart,
        items: cart.items.filter(item => item.id !== productId)
      }));
    },
    updateQuantity: (productId: number, quantity: number) => {
      update(cart => {
        const updatedItems = cart.items.map(item => 
          item.id === productId ? { ...item, quantity } : item
        ).filter(item => item.quantity > 0);
        
        return { ...cart, items: updatedItems };
      });
    },
    clearCart: () => {
      update(cart => ({ ...cart, items: [] }));
    },
    openCart: () => {
      update(cart => ({ ...cart, isOpen: true }));
    },
    closeCart: () => {
      update(cart => ({ ...cart, isOpen: false }));
    },
    toggleCart: () => {
      update(cart => ({ ...cart, isOpen: !cart.isOpen }));
    }
  };
}

export const cart = createCartStore();
export const { addToCart, removeFromCart, updateQuantity, clearCart, openCart, closeCart, toggleCart } = cart;