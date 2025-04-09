import { create } from "zustand";
import { persist } from "zustand/middleware";
import { CheckoutFormData } from "./checkout-schema";

export type CheckoutStep = "customer" | "shipping" | "payment";

interface FormStore {
  formData: Partial<CheckoutFormData>;
  setFormData: (formData: Partial<CheckoutFormData>) => void;
  step: CheckoutStep;
  setStep: (step: CheckoutStep) => void;
}

export const useFormStore = (checkoutId: string) =>
  create<FormStore>()(
    persist(
      (set) => ({
        formData: {},
        setFormData: (formData) => set({ formData }),
        step: "customer",
        setStep: (step) => set({ step }),
      }),
      { name: `checkout-${checkoutId}` }
    )
  );
