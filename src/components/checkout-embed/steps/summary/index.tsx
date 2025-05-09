import { Button } from "@/components/ui/button";
import { storeHelpers } from "@/lib/betterstore";
import { LineItem } from "@betterstore/sdk";
import clsx from "clsx";
import { ChevronDown } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormStore } from "../../useFormStore";

export default function CheckoutSummary({
  lineItems,
  shipping,
  tax,
  currency,
  onCancel,
  exchangeRate,
}: {
  lineItems: LineItem[];
  shipping?: number;
  tax?: number;
  currency: string;
  exchangeRate: number;
  onCancel: () => void;
}) {
  const { formData } = useFormStore();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const subtotal = lineItems.reduce((acc, item) => {
    const productItem = item.product.selectedVariant || item.product;

    return acc + (productItem?.priceInCents ?? 0) * item.quantity;
  }, 0);

  const shippingPrice = shipping ?? formData.shipping?.price;
  const total = subtotal + (tax ?? 0) + (shippingPrice ?? 0);

  return (
    <div className="grid gap-5">
      <div className="flex justify-between items-center">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 cursor-pointer"
        >
          <h2>{t("CheckoutEmbed.Summary.title")}</h2>
          <ChevronDown
            className={clsx("size-5 md:hidden transition-transform", {
              "rotate-180": isOpen,
            })}
          />
        </div>

        <p className="font-bold text-lg tracking-tight md:hidden">
          {storeHelpers.formatPrice(total, currency, exchangeRate)}
        </p>
        <Button
          className="max-sm:hidden"
          variant="link"
          size="link"
          onClick={onCancel}
        >
          {t("CheckoutEmbed.Summary.edit")}
        </Button>
      </div>

      <hr />

      <div
        className={clsx("gap-3 order-4 md:order-none", {
          "hidden md:grid": !isOpen,
          grid: isOpen,
        })}
      >
        <div className="flex justify-between">
          <p>{t("CheckoutEmbed.Summary.subtotal")}</p>
          <p>{storeHelpers.formatPrice(subtotal, currency, exchangeRate)}</p>
        </div>

        <div className="flex justify-between">
          <p>{t("CheckoutEmbed.Summary.shipping")}</p>
          <p>
            {!!shippingPrice
              ? storeHelpers.formatPrice(shippingPrice, currency, exchangeRate)
              : t("CheckoutEmbed.Summary.calculatedAtNextStep")}
          </p>
        </div>

        {!!tax && (
          <div className="flex justify-between">
            <p>{t("CheckoutEmbed.Summary.tax")}</p>
            <p>{storeHelpers.formatPrice(tax, currency, exchangeRate)}</p>
          </div>
        )}

        <div className="flex font-bold justify-between  items-center">
          <p>{t("CheckoutEmbed.Summary.total")}</p>
          <p>{storeHelpers.formatPrice(total, currency, exchangeRate)}</p>
        </div>
      </div>

      <hr
        className={clsx("order-5 md:order-none", {
          "hidden md:block": !isOpen,
          block: isOpen,
        })}
      />

      <div
        className={clsx("gap-5 order-3 md:order-none", {
          "hidden md:grid": !isOpen,
          grid: isOpen,
        })}
      >
        {lineItems.map((item, index) => {
          const productItem = item.product?.selectedVariant || item.product;

          return (
            <div key={index} className="flex items-center">
              <div className="relative">
                <div className="w-16 h-16 bg-secondary rounded-lg overflow-hidden relative">
                  {productItem?.images[0] && (
                    <img
                      src={
                        productItem.images[0] ||
                        item?.product?.images[0] ||
                        "/placeholder.svg"
                      }
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
                  {item.variantOptions.map((option) => (
                    <span key={option.name}>
                      {option.name}: {option.value}
                    </span>
                  ))}
                </p>
              </div>

              <div className="text-right">
                <p className="text-lg font-medium">
                  {storeHelpers.formatPrice(
                    productItem?.priceInCents ?? 0,
                    currency,
                    exchangeRate
                  )}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
