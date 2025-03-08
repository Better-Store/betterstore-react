import { z } from "zod";

// Shipping address schema
export const customerSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  marketingConsent: z.boolean().optional(),

  firstName: z.string().optional(),
  lastName: z.string().min(1, "Last name is required"),
  address: z.string().min(1, "Address is required"),
  apartment: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z.string().min(1, "State is required"),
  zipCode: z.string().min(5, "ZIP code is required"),
  country: z.string().min(1, "Country is required"),
  saveInfo: z.boolean().optional(),
});

// Shipping method schema
export const shippingMethodSchema = z.object({
  method: z.enum(["economy", "standard"]),
});

// Combined checkout schema
export const checkoutSchema = z.object({
  customer: customerSchema,
  shipping: shippingMethodSchema,
});

export type CheckoutFormData = z.infer<typeof checkoutSchema>;
export type CustomerFormData = z.infer<typeof customerSchema>;
export type ShippingMethodFormData = z.infer<typeof shippingMethodSchema>;
