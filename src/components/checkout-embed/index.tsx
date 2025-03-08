import React, { memo, useEffect, useState } from "react";
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

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!checkout) {
    return <div>Checkout not found</div>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>forms here</div>
      <div>
        <CheckoutSummary
          currency={checkout.currency}
          lineItems={checkout.lineItems}
          shipping={checkout?.shipping}
          tax={checkout?.tax}
        />
      </div>
    </div>
  );
}

export default memo(CheckoutEmbed);
