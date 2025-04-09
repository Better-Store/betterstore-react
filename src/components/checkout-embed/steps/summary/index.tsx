import { Button } from "@/components/ui/button";
import { CheckoutSession } from "@betterstore/sdk";
import React from "react";
import { useTranslation } from "react-i18next";

export default function CheckoutSummary({
  lineItems,
  shipping,
  tax,
  currency,
  cancelUrl,
}: {
  lineItems: CheckoutSession["lineItems"];
  shipping?: number;
  tax?: number;
  currency: string;
  cancelUrl: string;
}) {
  const { t } = useTranslation();
  const subtotal = lineItems.reduce((acc, item) => {
    return acc + (item.product?.priceInCents ?? 0) * item.quantity;
  }, 0);

  const total = subtotal + (tax ?? 0) + (shipping ?? 0);

  const formatPrice = (cents: number) => {
    return `${(cents / 100).toFixed(2)} ${currency}`;
  };

  return (
    <div className="grid gap-5">
      <div className="flex justify-between items-center">
        <h2>{t("CheckoutEmbed.Summary.title")}</h2>

        <Button variant="link" asChild>
          <a href={cancelUrl}>{t("CheckoutEmbed.Summary.edit")}</a>
        </Button>
      </div>

      <hr />

      <div className="grid gap-3">
        <div className="flex justify-between">
          <p>{t("CheckoutEmbed.Summary.subtotal")}</p>
          <p>{formatPrice(subtotal)}</p>
        </div>

        <div className="flex justify-between">
          <p>{t("CheckoutEmbed.Summary.shipping")}</p>
          <p>
            {!!shipping
              ? formatPrice(shipping)
              : t("CheckoutEmbed.Summary.calculatedAtNextStep")}
          </p>
        </div>

        {!!tax && (
          <div className="flex justify-between">
            <p>{t("CheckoutEmbed.Summary.tax")}</p>
            <p>{formatPrice(tax)}</p>
          </div>
        )}

        <div className="flex font-bold justify-between  items-center">
          <p>{t("CheckoutEmbed.Summary.total")}</p>
          <p>{formatPrice(total)}</p>
        </div>
      </div>

      <hr />

      {lineItems.map((item, index) => (
        <div key={index} className="flex items-center mb-6">
          <div className="relative">
            <div className="w-16 h-16 bg-secondary rounded-lg overflow-hidden relative">
              {item.product?.images[0] && (
                <img
                  src={item.product.images[0] || "/placeholder.svg"}
                  alt={item.product?.title || ""}
                  className="object-cover w-full h-full"
                  sizes="64px"
                />
              )}
            </div>
            <div className="absolute -top-2 -right-2 w-6 h-6 bg-primary rounded-full flex items-center text-background justify-center text-sm">
              {item.quantity}
            </div>
          </div>

          <div className="ml-4 flex-1">
            <h3 className="text-lg font-medium">{item.product?.title}</h3>
            <p className="text-muted-foreground text-sm">
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
    </div>
  );
}
