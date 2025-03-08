import { create } from "zustand";
import { persist } from "zustand/middleware";

interface LineItem {
  id: string;
  quantity: number;
  productId: string;
  variantOptions: { name: string; value: string }[];
  metadata?: string;
}

type LineItemOptionalParams = {
  quantity?: number;
  productId: string;
  variantOptions?: { name: string; value: string }[];
  metadata?: string;
};

interface Cart {
  lineItems: LineItem[];
  addItem: (
    productId: string,
    additionalParams?: LineItemOptionalParams
  ) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  getProductQuantity: (productId: string) => number;
  clearCart: () => void;
}

const generateLineItemId = (item: LineItemOptionalParams): string => {
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

      addItem: (productId, additionalParams) =>
        set((state) => {
          const formattedNewItem = {
            productId: productId,
            quantity: additionalParams?.quantity ?? 1,
            variantOptions: additionalParams?.variantOptions ?? [],
            metadata: additionalParams?.metadata,
          };

          const id = generateLineItemId(formattedNewItem);
          const existingItemIndex = state.lineItems.findIndex(
            (item) => item.id === id
          );

          if (existingItemIndex !== -1) {
            const updatedItems = [...state.lineItems];
            updatedItems[existingItemIndex] = {
              ...updatedItems[existingItemIndex]!,
              quantity:
                updatedItems[existingItemIndex]!.quantity +
                formattedNewItem.quantity,
            };
            return { lineItems: updatedItems };
          }

          return {
            lineItems: [...state.lineItems, { ...formattedNewItem, id }],
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
