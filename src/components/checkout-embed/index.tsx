import React, { memo, useEffect, useState } from "react";
import CheckoutForm from "./checkout-form";
import { CheckoutFormData } from "./checkout-schema";
import CheckoutSummary from "./summary";

function CheckoutEmbed({
  checkoutId,
  cancelUrl,
  successUrl,
}: {
  checkoutId: string;
  cancelUrl: string;
  successUrl: string;
}) {
  const [checkout, setCheckout] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true; // Add mounted flag for cleanup

    async function fetchCheckout() {
      try {
        const response = await fetch(
          `/api/betterstore/checkout?checkoutId=${checkoutId}`
        );
        const data = await response.json();

        if (mounted) {
          // Only update state if component is still mounted
          setCheckout(data);
          setLoading(false);
        }
      } catch (error) {
        console.error("Failed to fetch checkout:", error);
        if (mounted) {
          setLoading(false);
        }
      }
    }

    fetchCheckout();

    return () => {
      mounted = false; // Cleanup
    };
  }, [checkoutId]); // Only re-run if checkoutId changes

  const handleComplete = (formData: CheckoutFormData) => {
    console.log("Checkout complete:", formData);
    console.log("Success URL:", successUrl);
    // Here you would typically send the completed form data to your API
  };

  if (!checkout && !loading) {
    return <div>Checkout not found</div>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>
        {loading ? (
          <div className="text-white">Loading...</div>
        ) : (
          <CheckoutForm
            cancelUrl={cancelUrl}
            checkoutId={checkoutId}
            onComplete={handleComplete}
          />
        )}
      </div>
      <div>
        {loading ? (
          <div>Loading...</div>
        ) : (
          <CheckoutSummary
            currency={checkout.currency}
            lineItems={checkout.lineItems}
            shipping={checkout?.shipping}
            tax={checkout?.tax}
          />
        )}
      </div>
    </div>
  );
}

export default memo(CheckoutEmbed);
