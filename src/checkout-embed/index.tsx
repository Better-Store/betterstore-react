import BetterStore from "@betterstore/sdk";
import React from "react";
import CheckoutSummary from "./summary";

export default async function CheckoutEmbed({
  betterStore,
  checkoutId,
}: {
  betterStore: InstanceType<typeof BetterStore>;
  checkoutId: string;
}) {
  const checkout = await betterStore.checkout.retrieve(checkoutId);

  if (!checkout) {
    return <div>Checkout not found</div>;
  }

  return (
    <div className="grid md:grid-cols-2 gap-4">
      <div>forms heres</div>
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
