import { Button } from "@/components/ui/button";
import { storeHelpers } from "@/lib/betterstore";
import { CheckoutSession, LineItem } from "@betterstore/sdk";
import clsx from "clsx";
import { ChevronDown, X } from "lucide-react";
import React, { useState } from "react";
import { useTranslation } from "react-i18next";
import { useFormStore } from "../../useFormStore";
import DiscountCode from "./discount-code";

export default function CheckoutSummary({
  appliedDiscounts,
  lineItems,
  shipping,
  tax,
  currency,
  onCancel,
  exchangeRate,
  applyDiscountCode,
  removeDiscount,
}: {
  appliedDiscounts: CheckoutSession["appliedDiscounts"];
  lineItems: LineItem[];
  shipping?: number | null;
  tax?: number | null;
  currency: string;
  exchangeRate: number;
  onCancel: () => void;
  applyDiscountCode: (code: string) => Promise<void>;
  removeDiscount: (id: string) => Promise<void>;
}) {
  const { formData } = useFormStore();
  const [isOpen, setIsOpen] = useState(false);
  const { t } = useTranslation();
  const subtotal = lineItems.reduce((acc, item) => {
    const productItem = item.productData?.selectedVariant || item.productData;

    return acc + (productItem?.priceInCents ?? 0) * item.quantity;
  }, 0);

  const shippingPrice = shipping ?? formData.shipping?.price ?? 0;
  const total = subtotal + (tax ?? 0) + shippingPrice;
  const isShippingFree =
    subtotal > shippingPrice &&
    appliedDiscounts.some(
      (discount) => discount.discount.type === "FREE_SHIPPING"
    );
  const filteredDiscounts = appliedDiscounts.filter(
    (discount) => discount.discount.type !== "FREE_SHIPPING"
  );
  const totalWithDiscounts =
    total -
    filteredDiscounts.reduce((acc, { amount }) => acc + amount, 0) -
    (isShippingFree ? shippingPrice : 0);

  const allowedCombinations = appliedDiscounts.map(
    (discount) => discount.discount.allowedCombinations
  );

  // Find the intersection of all allowed combinations
  const sharedCombinations = allowedCombinations.reduce(
    (intersection, currentCombinations) => {
      if (intersection.length === 0) return currentCombinations;
      return intersection.filter((combination) =>
        currentCombinations.some(
          (currentCombination) =>
            JSON.stringify(currentCombination) === JSON.stringify(combination)
        )
      );
    },
    []
  );

  const canCombine =
    appliedDiscounts.length === 0 || sharedCombinations.length > 0;

  return (
    <div className="grid gap-5">
      <div className="flex justify-between items-center">
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-center gap-2 max-md:cursor-pointer"
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
        className={clsx("gap-2 order-4 md:order-none", {
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
            {isShippingFree
              ? t("CheckoutEmbed.Summary.free")
              : !!shippingPrice
                ? storeHelpers.formatPrice(
                    shippingPrice,
                    currency,
                    exchangeRate
                  )
                : t("CheckoutEmbed.Summary.calculatedAtNextStep")}
          </p>
        </div>

        {!!tax && (
          <div className="flex justify-between">
            <p>{t("CheckoutEmbed.Summary.tax")}</p>
            <p>{storeHelpers.formatPrice(tax, currency, exchangeRate)}</p>
          </div>
        )}

        {filteredDiscounts.map(({ discount, amount, id }) => (
          <div
            key={discount.id}
            className="flex justify-between text-muted-foreground"
          >
            <DiscountItem
              id={id}
              removeDiscount={removeDiscount}
              label={(discount?.code || discount?.title) ?? ""}
              canRemove={discount.method === "CODE"}
            />
            <p>- {storeHelpers.formatPrice(amount, currency, exchangeRate)}</p>
          </div>
        ))}

        <div className="flex font-bold justify-between items-center">
          <p>{t("CheckoutEmbed.Summary.total")}</p>
          <p>
            {storeHelpers.formatPrice(
              totalWithDiscounts,
              currency,
              exchangeRate
            )}
          </p>
        </div>
      </div>

      {canCombine && (
        <>
          <hr
            className={clsx("order-7 md:order-none", {
              "hidden md:block": !isOpen,
              block: isOpen,
            })}
          />

          <div
            className={clsx("gap-0 order-6 md:order-none", {
              "hidden md:grid": !isOpen,
              grid: isOpen,
            })}
          >
            <DiscountCode applyDiscountCode={applyDiscountCode} />
          </div>
        </>
      )}

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
          const finalItem =
            item.productData?.selectedVariant || item.productData;

          const productAppliedDiscounts = appliedDiscounts.filter((discount) =>
            discount.allowedLineItems.some(
              (allowedLineItem) =>
                allowedLineItem.productId === item.productData.productId
            )
          );
          const formattedProductAppliedDiscounts = productAppliedDiscounts.map(
            (discount) => {
              const elegibleLineItems = discount.allowedLineItems.find(
                (allowedLineItem) =>
                  allowedLineItem.productId === item.productData.productId
              );
              if (!elegibleLineItems) return 0;

              const elegibleQuantity = elegibleLineItems.quantity;
              const elegibleTotalAmount =
                (finalItem?.priceInCents ?? 0) * elegibleQuantity;

              if (discount.discount.valueType === "PERCENTAGE") {
                const percentage = discount.discount.value / 100;
                return elegibleTotalAmount * percentage;
              } else if (discount.discount.valueType === "FREE") {
                return elegibleTotalAmount;
              }

              return elegibleQuantity * discount.discount.value;
            }
          );
          const totalDiscountAmount =
            formattedProductAppliedDiscounts.length > 0
              ? formattedProductAppliedDiscounts.reduce((acc, curr) => {
                  return acc + curr;
                }, 0)
              : null;

          const isDiscounted = !!totalDiscountAmount;
          const discountedPrice =
            finalItem.priceInCents - (totalDiscountAmount ?? 0);

          return (
            <div key={index} className="flex items-center">
              <div className="relative">
                <div className="w-16 h-16 bg-secondary rounded-lg overflow-hidden relative">
                  {finalItem?.images[0] && (
                    <img
                      src={
                        finalItem.images[0] ||
                        item?.productData?.images[0] ||
                        "/placeholder.svg"
                      }
                      alt={item.productData?.title || ""}
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
                <h3 className="text-base font-medium">
                  {item.productData?.title}
                </h3>
                <p className="text-muted-foreground text-ellipsis line-clamp-1 md:max-w-[75%] text-sm">
                  {item.variantOptions
                    .map((option) => `${option.name}: ${option.value}`)
                    .join(", ")}
                </p>
              </div>

              <div className="text-right">
                {isDiscounted ? (
                  <div className="flex flex-col">
                    <p className="text-sm font-medium -mb-0.5 line-through text-muted-foreground">
                      {storeHelpers.formatPrice(
                        finalItem?.priceInCents ?? 0,
                        currency,
                        exchangeRate
                      )}
                    </p>
                    <p className="text-base font-medium">
                      {discountedPrice <= 0
                        ? t("CheckoutEmbed.Summary.free")
                        : storeHelpers.formatPrice(
                            discountedPrice,
                            currency,
                            exchangeRate
                          )}
                    </p>
                  </div>
                ) : (
                  <p className="text-base font-medium">
                    {storeHelpers.formatPrice(
                      finalItem?.priceInCents ?? 0,
                      currency,
                      exchangeRate
                    )}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function DiscountItem({
  id,
  removeDiscount,
  label,
  canRemove,
}: {
  id: string;
  removeDiscount: (id: string) => Promise<void>;
  label: string;
  canRemove: boolean;
}) {
  const [isLoading, setIsLoading] = useState(false);

  const handleRemove = async () => {
    setIsLoading(true);
    try {
      await removeDiscount(id);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-0.5">
      <p>{isLoading ? "Removing..." : label}</p>
      {!isLoading && canRemove && (
        <div
          onClick={handleRemove}
          className="flex items-center z-10 relative -m-0.5 hover:bg-muted p-1 rounded-full justify-center hover:text-foreground cursor-pointer"
        >
          <X className="size-3" />
          <p className="sr-only">Remove</p>
        </div>
      )}
    </div>
  );
}
