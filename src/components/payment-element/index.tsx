import { Elements } from "@stripe/react-stripe-js";
import {
  Appearance,
  loadStripe,
  StripeElementLocale,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import React, { memo } from "react";
import CheckoutForm from "./checkout-form";

const publicStripeKey =
  "pk_test_51RCjhw2cgbkVT71muwgBSw1tP06YVR4l4P9zI8wP2ipmze9VnTmTwxESVVePmU6QV8TL6bxG7f10oXQRnKC3F3KT00EsvlPAoS";

const stripePromise = loadStripe(publicStripeKey);

function PaymentElement({
  paymentSecret,
  checkoutAppearance,
  locale,
  fonts,
  onSuccess,
  onError,
  children,
}: {
  paymentSecret: string;
  checkoutAppearance?: Appearance;
  locale?: StripeElementLocale;
  fonts?: StripeElementsOptions["fonts"];
  onSuccess?: () => void;
  onError?: () => void;
  children: React.ReactNode;
}) {
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
      />
    </Elements>
  );
}

export default memo(PaymentElement);
