"use client";

import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { memo, useState } from "react";
import { useCheckout } from "./useCheckout";

const CheckoutForm = ({
  onSuccess,
  onError,
  children,
}: {
  onSuccess?: () => void;
  onError?: () => void;
  children: React.ReactNode;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { setIsSubmitting } = useCheckout();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsSubmitting(true);

    const response = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (response.error) {
      setErrorMessage(response.error.message || "Something went wrong.");
      setIsSubmitting(false);
      onError?.();
    } else {
      setErrorMessage(undefined);
      setIsSubmitting(false);
      onSuccess?.();
    }

    setErrorMessage(undefined);
    setIsSubmitting(false);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <PaymentElement />
        <p className="text-red-500">{errorMessage}</p>
      </div>
      {children}
    </form>
  );
};

export default memo(CheckoutForm);
