import { Product } from "@/sanity.types";
import { persist } from "zustand/middleware";
import { create } from "zustand";

export type BasketItem = {
  product: Product;
  quantity: number;
};

type BasketState = {
  items: BasketItem[];
  addItem: (product: Product) => void;
  removeItem: (productId: string) => void;
  clearBasket: () => void;
  getTotalPrice: () => number;
  getItemCount: (productId: string) => number;
  getGroupedItems: () => BasketItem[];
};

const useBasketStore = create<BasketState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product) => {
        const items = get().items;
        const existingItem = items.find(
          (item) => item.product._id === product._id
        );
        if (existingItem) {
          set({
            items: items.map((item) =>
              item.product._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            ),
          });
        } else {
          set({ items: [...items, { product, quantity: 1 }] });
        }
      },
      removeItem: (productId) => {
        const items = get().items;
        set({ items: items.filter((item) => item.product._id !== productId) });
      },
      clearBasket: () => {
        set({ items: [] });
      },
      getTotalPrice: () => {
        const items = get().items;
        return items.reduce(
          (total, item) => total + (item.product.price || 0) * item.quantity,
          0
        );
      },
      getItemCount: (productId) => {
        const items = get().items;
        const item = items.find((item) => item.product._id === productId);
        return item ? item.quantity : 0;
      },
      getGroupedItems: () => get().items,
    }),
    {
      name: "baske-store",
    }
  )
);

export default useBasketStore;
