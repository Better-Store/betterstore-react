import {
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import React, { memo, useEffect, useRef, useState } from "react";
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
  const containerRef = useRef<HTMLDivElement>(null);
  const [portalPosition, setPortalPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
    height: 0,
  });

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

  useEffect(() => {
    const updatePosition = () => {
      if (containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        setPortalPosition({
          top: rect.top,
          left: rect.left,
          width: rect.width,
          height: rect.height,
        });
      }
    };

    // Initial position
    updatePosition();

    // Update position on resize and scroll
    window.addEventListener("resize", updatePosition);
    window.addEventListener("scroll", updatePosition);

    return () => {
      window.removeEventListener("resize", updatePosition);
      window.removeEventListener("scroll", updatePosition);
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

    return (
      <>
        <div
          ref={containerRef}
          className="w-full"
          style={{ height: "400px" }}
        />
        {ReactDOM.createPortal(
          <div
            style={{
              position: "absolute",
              top: portalPosition.top,
              left: portalPosition.left,
              width: portalPosition.width,
              height: portalPosition.height,
            }}
          >
            <PaymentElement />
          </div>,
          portalContainer
        )}
      </>
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
