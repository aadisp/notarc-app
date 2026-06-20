import { create } from "zustand";
import { persist } from "zustand/middleware";

interface CartItem {
  id: number;
  name: string;
  price: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: CartItem) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set) => ({
      items: [],

      addItem: (item) =>
        set((state) => ({
          items: [...state.items, item],
        })),
    }),
    {
      name: "notarc-cart",
    }
  )
);