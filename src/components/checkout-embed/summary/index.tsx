import BetterStore from "@betterstore/sdk";
import React from "react";

export default function CheckoutSummary({
  lineItems,
  shipping,
  tax,
  currency,
}: {
  lineItems: Awaited<
    Awaited<
      ReturnType<InstanceType<typeof BetterStore>["checkout"]["retrieve"]>
    >["lineItems"]
  >;
  shipping?: number;
  tax?: number;
  currency: string;
}) {
  const subtotal = lineItems.reduce((acc, item) => {
    return acc + (item.product?.priceInCents ?? 0) * item.quantity;
  }, 0);

  const total = subtotal + (tax ?? 0) + (shipping ?? 0);

  const formatPrice = (cents: number) => {
    return `${(cents / 100).toFixed(2)} ${currency}`;
  };

  return (
    <div className="bg-black text-white p-6 rounded-lg">
      {/* Line Items */}
      {lineItems.map((item, index) => (
        <div key={index} className="flex items-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-zinc-900 rounded-lg overflow-hidden relative">
              {item.product?.images[0] && (
                <img
                  src={item.product.images[0] || "/placeholder.svg"}
                  alt={item.product?.title || "Product image"}
                  className="object-cover"
                />
              )}
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-zinc-700 rounded-full flex items-center justify-center text-sm">
              {item.quantity}
            </div>
          </div>

          <div className="ml-4 flex-1">
            <h3 className="text-lg font-medium">
              {item.product?.title || "Product"}
            </h3>
            <p className="text-zinc-400 text-sm">
              {item.variantOptions.map((option) => option.name).join(" / ")}
            </p>
          </div>

          <div className="text-right">
            <p className="text-lg font-medium">
              {formatPrice(item.product?.priceInCents ?? 0)}
            </p>
          </div>
        </div>
      ))}

      {/* Summary */}
      <div className="border-t border-zinc-800 pt-4 mt-2">
        <div className="flex justify-between py-2">
          <span className="text-lg">Subtotal</span>
          <span className="text-lg">{formatPrice(subtotal)}</span>
        </div>

        <div className="flex justify-between py-2">
          <span className="text-lg">Shipping</span>
          <span className="text-zinc-400">
            {shipping !== undefined
              ? formatPrice(shipping)
              : "Calculated at next step"}
          </span>
        </div>

        {tax !== undefined && (
          <div className="flex justify-between py-2">
            <span className="text-lg">Tax</span>
            <span className="text-lg">{formatPrice(tax)}</span>
          </div>
        )}

        <div className="flex justify-between py-4 mt-2 border-t border-zinc-800 items-center">
          <span className="text-2xl font-bold">Total</span>
          <div className="text-right">
            <span className="text-zinc-400 text-sm mr-2">{currency}</span>
            <span className="text-2xl font-bold">{formatPrice(total)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
