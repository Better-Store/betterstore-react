import SubmitButton from "@/components/compounds/form/submit-button";
import PaymentElement from "@/components/payment-element";
import { Button } from "@/components/ui/button";
import { StripeElementLocale, StripeElementsOptions } from "@stripe/stripe-js";
import { ChevronLeft } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  AppearanceConfig,
  convertCheckoutAppearanceToStripeAppearance,
} from "../../appearance";

interface PaymentFormProps {
  paymentSecret: string | null;
  onSuccess: () => void;
  onError: () => void;
  onBack: () => void;
  onDoubleBack: () => void;
  contactEmail: string;
  shippingAddress: string;
  shippingName: string;
  shippingPrice: string;
  checkoutAppearance?: AppearanceConfig;
  fonts?: StripeElementsOptions["fonts"];
  locale?: StripeElementLocale;
  publicKey: string | null;
}

export default function PaymentForm({
  paymentSecret,
  onSuccess,
  onError,
  onBack,
  onDoubleBack,
  contactEmail,
  shippingAddress,
  shippingName,
  shippingPrice,
  checkoutAppearance,
  fonts,
  locale,
  publicKey,
}: PaymentFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [key, setKey] = useState(0);
  const { t } = useTranslation();

  useEffect(() => {
    if (paymentSecret) {
      setKey((prev) => prev + 1);
    }
  }, [paymentSecret]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="mb-2">{t("CheckoutEmbed.Payment.title")}</h2>
        <p className="text-sm text-muted-foreground">
          {t("CheckoutEmbed.Payment.description")}
        </p>
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm">
          <p>
            <span className="font-medium">
              {t("CheckoutEmbed.Shipping.contact")}
            </span>{" "}
            <span className="text-muted-foreground">{contactEmail}</span>
          </p>
          <Button variant="link" size="link" onClick={onDoubleBack}>
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
          <Button variant="link" size="link" onClick={onDoubleBack}>
            {t("CheckoutEmbed.Shipping.change")}
          </Button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <p>
            <span className="font-medium">
              {t("CheckoutEmbed.Shipping.shipping")}
            </span>{" "}
            <span className="text-muted-foreground">
              {shippingName} · {shippingPrice}
            </span>
          </p>
          <Button variant="link" size="link" onClick={onBack}>
            {t("CheckoutEmbed.Shipping.change")}
          </Button>
        </div>
      </div>

      <div className="mt-8">
        {paymentSecret && (
          <PaymentElement
            key={key}
            fonts={fonts}
            checkoutAppearance={convertCheckoutAppearanceToStripeAppearance(
              checkoutAppearance,
              fonts
            )}
            locale={locale}
            paymentSecret={paymentSecret}
            onSuccess={onSuccess}
            onError={onError}
            setSubmitting={setIsSubmitting}
            publicKey={publicKey}
          >
            <div className="flex justify-between items-center pt-8">
              <Button type="button" variant="ghost" onClick={onBack}>
                <ChevronLeft />
                {t("CheckoutEmbed.Payment.back")}
              </Button>
              <SubmitButton isValid={true} isSubmitting={isSubmitting}>
                {t("CheckoutEmbed.Payment.button")}
              </SubmitButton>
            </div>
          </PaymentElement>
        )}
      </div>
    </div>
  );
}
