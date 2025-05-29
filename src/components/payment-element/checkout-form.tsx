import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { memo, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { useCheckout } from "./useCheckout";

const CheckoutForm = ({
  onSuccess,
  onError,
  children,
  setSubmitting,
}: {
  onSuccess?: () => void;
  onError?: () => void;
  children: React.ReactNode;
  setSubmitting?: (isSubmitting: boolean) => void;
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const { setIsSubmitting } = useCheckout();
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined
  );
  const [portalContainer, setPortalContainer] = useState<HTMLElement | null>(
    null
  );

  useEffect(() => {
    // Create a container for the portal outside the iframe
    const container = document.createElement("div");
    container.style.position = "fixed";
    container.style.top = "0";
    container.style.left = "0";
    container.style.width = "100%";
    container.style.height = "100%";
    container.style.zIndex = "9999";
    container.style.pointerEvents = "none";
    document.body.appendChild(container);
    setPortalContainer(container);

    return () => {
      if (container && container.parentNode) {
        container.parentNode.removeChild(container);
      }
    };
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setSubmitting?.(true);
    setIsSubmitting(true);

    const response = await stripe.confirmPayment({
      elements,
      redirect: "if_required",
    });

    if (response.error) {
      setErrorMessage(response.error.message || "Something went wrong.");
      setIsSubmitting(false);
      setSubmitting?.(false);
      onError?.();
    } else {
      setErrorMessage(undefined);
      setIsSubmitting(false);
      setSubmitting?.(false);
      onSuccess?.();
    }
  };

  const PaymentElementPortal = () => {
    if (!portalContainer) return null;

    return ReactDOM.createPortal(
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          width: "100%",
          maxWidth: "500px",
          pointerEvents: "auto",
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "8px",
          boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
        }}
      >
        <PaymentElement />
      </div>,
      portalContainer
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <PaymentElementPortal />
        <p className="text-red-500">{errorMessage}</p>
      </div>
      {children}
    </form>
  );
};

export default memo(CheckoutForm);
