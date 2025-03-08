import React, { memo, useEffect, useState } from "react";
import CheckoutForm from "./checkout-form";
import CheckoutSummary from "./summary";

function CheckoutEmbed({ checkoutId }: { checkoutId: string }) {
  const [checkout, setCheckout] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchCheckout() {
      try {
        const response = await fetch(
          `/api/betterstore/checkout?checkoutId=${checkoutId}`
        );
        const data = await response.json();

        setCheckout(data);
      } catch (error) {
        console.error("Failed to fetch checkout:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchCheckout();
  }, [checkoutId]);

  const handleComplete = (formData: any) => {
    console.log("Checkout complete:", formData);
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
          <CheckoutForm checkoutId={checkoutId} onComplete={handleComplete} />
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
