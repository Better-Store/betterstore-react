import { default as createI18nInstance, Locale } from "@/i18n";
import { CheckoutSession, createStoreClient } from "@betterstore/sdk";
import { StripeElementsOptions } from "@stripe/stripe-js";
import React, { memo, useEffect, useState } from "react";
import Appearance, { AppearanceConfig } from "./appearance";
import CheckoutForm from "./checkout-form";
import CheckoutFormLoading from "./checkout-form-loading";
import CheckoutSummary from "./steps/summary";
import CheckoutSummaryLoading from "./steps/summary/loading";
import { useFormStore } from "./useFormStore";

interface CheckoutEmbedProps {
  checkoutId: string;
  config: {
    clientSecret: string;
    cancelUrl: string;
    successUrl: string;
    appearance?: AppearanceConfig;
    fonts?: StripeElementsOptions["fonts"];
    locale?: Locale;
    clientProxy?: string;
  };
}

function CheckoutEmbed({ checkoutId, config }: CheckoutEmbedProps) {
  const {
    cancelUrl,
    successUrl,
    appearance,
    locale,
    clientSecret,
    clientProxy,
  } = config;
  const storeClient = createStoreClient({ proxy: clientProxy });

  React.useMemo(() => createI18nInstance(locale), []);

  const { formData, setFormData, step, setStep } = useFormStore();

  const [checkout, setCheckout] = useState<CheckoutSession | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true; // Add mounted flag for cleanup

    async function fetchCheckout() {
      try {
        const newCheckout = await storeClient.retrieveCheckout(
          clientSecret,
          checkoutId
        );

        if (mounted) {
          // Only update state if component is still mounted
          setCheckout(newCheckout);
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

  const onSuccess = () => {
    setStep("customer");
    setFormData({ customer: formData.customer });
    if (successUrl) {
      window.location.href = successUrl;
    }
  };

  const onCancel = () => {
    setStep("customer");
    setFormData({ customer: formData.customer });
    if (cancelUrl) {
      window.location.href = cancelUrl;
    }
  };

  const onError = () => {};

  if (!checkout && !loading) {
    throw new Error("Checkout not found");
  }

  const setShippingCost = (cost: number) => {
    if (!checkout) return;
    setCheckout({ ...checkout, shipping: cost });
  };

  return (
    <div className="checkout-embed scrollbar-hidden mx-auto max-w-[1200px] min-h-screen overflow-x-hidden gap-6 md:gap-0 py-4 md:py-12 flex flex-col md:grid md:grid-cols-7 ">
      <Appearance appearance={appearance} />
      <div className="md:col-span-4 px-4 md:px-8">
        {loading ? (
          <CheckoutFormLoading />
        ) : (
          <CheckoutForm
            locale={locale}
            setShippingCost={setShippingCost}
            storeClient={storeClient}
            fonts={config.fonts}
            checkoutAppearance={appearance}
            currency={checkout?.currency ?? ""}
            customer={checkout?.customer}
            cancelUrl={cancelUrl}
            checkoutId={checkoutId}
            clientSecret={clientSecret}
            onSuccess={onSuccess}
            onError={onError}
            exchangeRate={checkout?.exchangeRate ?? 1}
          />
        )}
      </div>
      <div className="md:col-span-3 px-4 md:px-8 order-first md:order-last">
        {loading ? (
          <CheckoutSummaryLoading />
        ) : (
          <CheckoutSummary
            currency={checkout?.currency ?? ""}
            lineItems={checkout?.lineItems ?? []}
            shipping={checkout?.shipping}
            tax={checkout?.tax}
            onCancel={onCancel}
            exchangeRate={checkout?.exchangeRate ?? 1}
          />
        )}
      </div>
    </div>
  );
}

export default memo(CheckoutEmbed);
