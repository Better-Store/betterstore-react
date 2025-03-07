"use client";

import { Elements } from "@stripe/react-stripe-js";
import {
  loadStripe,
  StripeElementLocale,
  StripeElementsOptions,
} from "@stripe/stripe-js";
import React, { memo } from "react";
import CheckoutForm from "./checkout-form";

const publicStripeKey =
  "pk_test_51OjSZ2JoDmiuDQz4Vub296KIgTCy4y8NJos59h93bq3sLe3veuXnV9XVmvvWDFlt3aEWHY4pOuIXyahEjjKZwezn00qo4U5fQS";

const stripePromise = loadStripe(publicStripeKey);

function PaymentElement({
  paymentSecret,
  checkoutAppearance,
  onSuccess,
  onError,
  children,
}: {
  paymentSecret: string;
  checkoutAppearance?: Omit<StripeElementsOptions, "clientSecret" | "mode">;
  onSuccess?: () => void;
  onError?: () => void;
  children: React.ReactNode;
}) {
  const options = {
    locale: "en" as StripeElementLocale,
    ...(checkoutAppearance ? checkoutAppearance : {}),
    clientSecret: paymentSecret as string,
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
