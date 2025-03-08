import React, { useEffect, useState } from "react";
import type {
  CheckoutFormData,
  CustomerFormData,
  ShippingMethodFormData,
} from "./checkout-schema";
import CustomerForm from "./customer/form";
import PaymentForm from "./payment/form";
import ShippingMethodForm from "./shipping/form";
import { useLocalStorage } from "./useLocalStorage";

type CheckoutStep = "customer" | "shipping" | "payment";

interface CheckoutFormProps {
  checkoutId: string;
  onComplete?: (data: CheckoutFormData) => void;
  cancelUrl: string;
}

export default function CheckoutForm({
  checkoutId,
  onComplete,
  cancelUrl,
}: CheckoutFormProps) {
  const [paymentSecret, setPaymentSecret] = useState<string | null>(null);
  const [step, setStep] = useState<CheckoutStep>("customer");
  const [formData, setFormData] = useLocalStorage<Partial<CheckoutFormData>>(
    `checkout-${checkoutId}`,
    {}
  );

  // Helper function to format address for display
  const formatAddress = (address: CustomerFormData): string => {
    return `${address.address}, ${address.city} ${address.state} ${address.zipCode}, ${address.country}`;
  };

  // Format shipping method for display
  const formatShippingMethod = (
    method: string
  ): { name: string; price: string } => {
    switch (method) {
      case "economy":
        return { name: "Economy", price: "$4.90" };
      case "standard":
        return { name: "Standard", price: "$6.90" };
      default:
        return { name: "Economy", price: "$4.90" };
    }
  };

  // Handle address form submission
  const handleCustomerSubmit = (data: CustomerFormData) => {
    setFormData({
      ...formData,
      customer: data,
    });
    setStep("shipping");
  };

  // Handle shipping method form submission
  const handleShippingSubmit = (data: ShippingMethodFormData) => {
    setFormData({
      ...formData,
      shipping: data,
    });
    setStep("payment");
  };

  // Handle payment form submission
  const handlePaymentSubmit = (data: any) => {
    const completeFormData = {
      ...formData,
      payment: data,
    } as CheckoutFormData;

    setFormData(completeFormData);

    if (onComplete) {
      onComplete(completeFormData);
    }
  };

  // Navigate back to previous step
  const handleBack = () => {
    if (step === "customer") {
      window.location.replace(cancelUrl);
    }
    if (step === "shipping") setStep("customer");
    if (step === "payment") setStep("shipping");
  };

  useEffect(() => {
    const fetchPaymentSecret = async () => {
      const response = await fetch(
        `/api/betterstore/checkout/payment/${checkoutId}`
      );
      const data = await response.json();
      setPaymentSecret(data);
    };

    fetchPaymentSecret();
  }, []);

  return (
    <div className="space-y-6">
      {step === "customer" && (
        <CustomerForm
          initialData={formData.customer}
          onSubmit={handleCustomerSubmit}
          onBack={handleBack}
        />
      )}

      {step === "shipping" && formData.customer && (
        <ShippingMethodForm
          initialData={formData.shipping}
          onSubmit={handleShippingSubmit}
          onBack={handleBack}
          contactEmail={formData.customer.email}
          shippingAddress={formatAddress(formData.customer)}
        />
      )}

      {step === "payment" &&
        formData.customer &&
        formData.customer &&
        formData.shipping && (
          <PaymentForm
            paymentSecret={paymentSecret}
            onSubmit={handlePaymentSubmit}
            onBack={handleBack}
            contactEmail={formData.customer.email}
            shippingAddress={formatAddress(formData.customer)}
            shippingMethod={formatShippingMethod(formData.shipping.method).name}
            shippingPrice={formatShippingMethod(formData.shipping.method).price}
          />
        )}
    </div>
  );
}
