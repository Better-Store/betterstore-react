import { Elements } from "@stripe/react-stripe-js";
import {
  Appearance,
  loadStripe,
  StripeElementLocale,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import React, { memo } from "react";
import CheckoutForm from "./checkout-form";

function PaymentElement({
  paymentSecret,
  publicKey,
  checkoutAppearance,
  locale,
  fonts,
  onSuccess,
  onError,
  children,
  setSubmitting,
}: {
  paymentSecret: string;
  publicKey: string | null;
  checkoutAppearance?: Appearance;
  locale?: StripeElementLocale;
  fonts?: StripeElementsOptions["fonts"];
  onSuccess?: () => void;
  onError?: () => void;
  children: React.ReactNode;
  setSubmitting?: (isSubmitting: boolean) => void;
}) {
  const stripePromise = loadStripe(publicKey ?? "");

  const options = {
    locale: locale ?? "en",
    appearance: checkoutAppearance,
    clientSecret: paymentSecret as string,
    fonts: fonts,
  } satisfies StripeElementsOptions;

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm
        onSuccess={onSuccess}
        onError={onError}
        children={children}
        setSubmitting={setSubmitting}
      />
    </Elements>
  );
}

export default memo(PaymentElement);
