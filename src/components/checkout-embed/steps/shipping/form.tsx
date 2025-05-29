import SubmitButton from "@/components/compounds/form/submit-button";
import { Button } from "@/components/ui/button";
import { Form, FormMessage } from "@/components/ui/form";
import { Skeleton } from "@/components/ui/skeleton";
import { storeHelpers } from "@/lib/betterstore";
import { ShippingRate } from "@betterstore/sdk";
import { zodResolver } from "@hookform/resolvers/zod";
import clsx from "clsx";
import { ChevronLeft } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import {
  type ShippingMethodFormData,
  shippingMethodSchema,
} from "../../checkout-schema";
import { FormStore } from "../../useFormStore";
import ShippingOptionWrapper from "./shipping-option-wrapper";

interface ShippingMethodFormProps {
  shippingRates: ShippingRate[];
  initialData?: ShippingMethodFormData;
  onSubmit: (data: ShippingMethodFormData) => void;
  onBack: () => void;
  contactEmail: string;
  shippingAddress: string;
  currency: string;
  exchangeRate: number;
  locale?: string;
  countryCode?: string;
  setFormData: FormStore["setFormData"];
  formData: FormStore["formData"];
}

export default function ShippingMethodForm({
  shippingRates,
  initialData,
  onSubmit,
  onBack,
  contactEmail,
  shippingAddress,
  currency,
  exchangeRate,
  locale,
  countryCode,
  setFormData,
  formData,
}: ShippingMethodFormProps) {
  const { t } = useTranslation();

  const form = useForm<ShippingMethodFormData>({
    resolver: zodResolver(shippingMethodSchema),
    defaultValues: initialData || {
      rateId: "",
      provider: "",
      price: 0,
      pickupPointId: "",
      pickupPointDisplayName: "",
    },
  });

  const currentRateId = form.watch("rateId");

  return (
    <div className="space-y-6">
      <h2>{t("CheckoutEmbed.Shipping.title")}</h2>

      <div className="space-y-2 pb-2">
        <div className="flex items-center justify-between text-sm">
          <p>
            <span className="font-medium">
              {t("CheckoutEmbed.Shipping.contact")}
            </span>{" "}
            <span className="text-muted-foreground">{contactEmail}</span>
          </p>
          <Button variant="link" size="link" onClick={onBack}>
            {t("CheckoutEmbed.Shipping.change")}
          </Button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <p>
            <span className="font-medium">
              {t("CheckoutEmbed.Shipping.address")}
            </span>{" "}
            <span className="text-muted-foreground">{shippingAddress}</span>
          </p>
          <Button variant="link" size="link" onClick={onBack}>
            {t("CheckoutEmbed.Shipping.change")}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          {shippingRates.length === 0 &&
            Array.from({ length: 3 }).map((_, index) => (
              <ShippingRateLoading key={index} />
            ))}
          {shippingRates.map((rate) => {
            const pickupPointDisplayName = form.watch("pickupPointDisplayName");
            const rateId = rate.provider + rate.name;
            const intPrice = Math.ceil(Number(rate.price));
            const displayPrice = storeHelpers.formatPrice(
              intPrice,
              currency,
              exchangeRate
            );

            const description =
              rate.provider === "zasilkovna"
                ? t("CheckoutEmbed.Shipping.description.zasilkovna")
                : t("CheckoutEmbed.Shipping.description.other");

            return (
              <ShippingOptionWrapper
                rate={rate}
                key={rateId}
                onPickupPointSelected={(
                  pickupPointId: string,
                  pickupPointName: string
                ) => {
                  const newFormData = {
                    rateId,
                    provider: rate.provider,
                    price: intPrice,
                    name: rate.name,
                    pickupPointId:
                      rate.provider === "zasilkovna" ? pickupPointId : "",
                    pickupPointDisplayName:
                      rate.provider === "zasilkovna" ? pickupPointName : "",
                  };

                  form.setValue("rateId", newFormData.rateId);
                  form.setValue("provider", newFormData.provider);
                  form.setValue("name", newFormData.name);
                  form.setValue("price", newFormData.price);
                  form.setValue("pickupPointId", newFormData.pickupPointId);
                  form.setValue(
                    "pickupPointDisplayName",
                    newFormData.pickupPointDisplayName
                  );

                  setFormData({
                    ...formData,
                    shipping: {
                      ...newFormData,
                    },
                  });
                }}
                locale={locale}
                countryCode={countryCode}
              >
                <div
                  className={clsx(
                    "p-4 cursor-pointer rounded-md border bg-background",
                    {
                      "bg-muted border-primary": currentRateId === rateId,
                    }
                  )}
                >
                  <div className="flex items-center justify-between w-full">
                    <p>{rate.name}</p>
                    <p>{displayPrice}</p>
                  </div>
                  <p className="text-sm text-muted-foreground">{description}</p>
                  {pickupPointDisplayName && (
                    <>
                      <hr className="my-2" />
                      <p className="text-sm text-muted-foreground">
                        {t("CheckoutEmbed.Shipping.description.shippedTo")}{" "}
                        <span className="text-foreground">
                          {pickupPointDisplayName}
                        </span>
                      </p>
                    </>
                  )}
                </div>
              </ShippingOptionWrapper>
            );
          })}

          <FormMessage>{form.formState.errors.rateId?.message}</FormMessage>

          <div className="flex justify-between items-center pt-4">
            <Button type="button" variant="ghost" onClick={onBack}>
              <ChevronLeft />
              {t("CheckoutEmbed.Shipping.back")}
            </Button>
            <SubmitButton
              isSubmitting={form.formState.isSubmitting}
              isValid={!!currentRateId}
            >
              {t("CheckoutEmbed.Shipping.button")}
            </SubmitButton>
          </div>
        </form>
      </Form>
    </div>
  );
}

function ShippingRateLoading() {
  return (
    <div
      className={clsx(
        "p-4 cursor-pointer grid gap-[10px] rounded-md border bg-background"
      )}
    >
      <div className="flex items-center justify-between w-full">
        <Skeleton className="w-12 h-5" />
        <Skeleton className="w-16 h-5" />
      </div>
      <Skeleton className="w-40 h-3.5" />
    </div>
  );
}
