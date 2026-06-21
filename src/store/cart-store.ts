import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];

  addItem: (
    item: Omit<CartItem, "quantity">
  ) => void;

  increaseQuantity: (
    id: number
  ) => void;

  decreaseQuantity: (
    id: number
  ) => void;

  removeItem: (
    id: number
  ) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => {

          const existingItem =
            state.items.find(
              (cartItem) =>
                cartItem.id === item.id
            );

          if (existingItem) {
            return {
              items: state.items.map(
                (cartItem) =>
                  cartItem.id === item.id
                    ? {
                        ...cartItem,
                        quantity:
                          cartItem.quantity + 1,
                      }
                    : cartItem
              ),
            };
          }

          return {
            items: [
              ...state.items,
              {
                ...item,
                quantity: 1,
              },
            ],
          };
        }),
        
        increaseQuantity: (id) =>
          set((state) => ({
            items: state.items.map((item) =>
              item.id === id
                ? {
                    ...item,
                    quantity:
                      item.quantity + 1,
                  }
                : item
            ),
          })),

        decreaseQuantity: (id) =>
          set((state) => ({
            items: state.items
              .map((item) =>
                item.id === id
                  ? {
                      ...item,
                      quantity:
                        item.quantity - 1,
                    }
                  : item
              )
              .filter(
                (item) =>
                  item.quantity > 0
              ),
          })),

        removeItem: (id) =>
          set((state) => ({
            items: state.items.filter(
              (item) => item.id !== id
            ),
          })),
    }),
    {
      name: "notarc-cart",
    }
  )
);