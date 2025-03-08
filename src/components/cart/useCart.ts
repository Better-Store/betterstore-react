import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LineItem {
  id: string;
  quantity: number;
  productId: string;
  variantOptions: { name: string; value: string }[];
  metadata?: string;
}

type LineItemWithoutId = Omit<LineItem, "id">;

interface Cart {
  lineItems: LineItem[];
  addItem: (item: LineItemWithoutId) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  getProductQuantity: (productId: string) => number;
  clearCart: () => void;
}

const generateLineItemId = (item: LineItemWithoutId): string => {
  return btoa(
    JSON.stringify({
      productId: item.productId,
      variantOptions: item.variantOptions,
      metadata: item.metadata,
    })
  );
};

export const useCart = create<Cart>()(
  persist(
    (set, get) => ({
      lineItems: [],

      addItem: (newItem) =>
        set((state) => {
          const id = generateLineItemId(newItem);
          const existingItemIndex = state.lineItems.findIndex(
            (item) => item.id === id
          );

          if (existingItemIndex !== -1) {
            const updatedItems = [...state.lineItems];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex]!,
              quantity:
                updatedItems[existingItemIndex]!.quantity + newItem.quantity,
            };
            return { lineItems: updatedItems };
          }

          return {
            lineItems: [...state.lineItems, { ...newItem, id }],
          };
        }),

      removeItem: (id) =>
        set((state) => ({
          lineItems: state.lineItems.filter((i) => i.id !== id),
        })),

      updateQuantity: (id, quantity) =>
        set((state) => ({
          lineItems: state.lineItems.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        })),

      getProductQuantity: (productId: string) => {
        const items = get().lineItems.filter(
          (item) => item.productId === productId
        );
        return items.reduce((acc, item) => acc + item.quantity, 0);
      },

      clearCart: () => set({ lineItems: [] }),
    }),
    {
      name: "cart",
    }
  )
);
