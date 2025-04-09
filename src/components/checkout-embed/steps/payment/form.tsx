import SubmitButton from "@/components/compounds/form/submit-button";
import PaymentElement from "@/components/payment-element";
import { Button } from "@/components/ui/button";
import { ChevronLeft } from "lucide-react";
import React from "react";
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
  shippingProvider: string;
  shippingPrice: string;
  checkoutAppearance?: AppearanceConfig;
}

export default function PaymentForm({
  paymentSecret,
  onSuccess,
  onError,
  onBack,
  onDoubleBack,
  contactEmail,
  shippingAddress,
  shippingProvider,
  shippingPrice,
  checkoutAppearance,
}: PaymentFormProps) {
  const { t } = useTranslation();

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
          <Button variant="link" onClick={onDoubleBack}>
            {t("CheckoutEmbed.Shipping.change")}
          </Button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <p>
            <span className="font-medium">
              {t("CheckoutEmbed.Shipping.shipTo")}
            </span>{" "}
            <span className="text-muted-foreground">{shippingAddress}</span>
          </p>
          <Button variant="link" onClick={onDoubleBack}>
            {t("CheckoutEmbed.Shipping.change")}
          </Button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <p>
            <span className="font-medium">
              {t("CheckoutEmbed.Shipping.shipping")}
            </span>{" "}
            <span className="text-muted-foreground">
              {shippingProvider} · {shippingPrice}
            </span>
          </p>
          <Button variant="link" onClick={onBack}>
            {t("CheckoutEmbed.Shipping.change")}
          </Button>
        </div>
      </div>

      <div className="mt-8">
        {paymentSecret && (
          <PaymentElement
            checkoutAppearance={convertCheckoutAppearanceToStripeAppearance(
              checkoutAppearance
            )}
            paymentSecret={paymentSecret}
            onSuccess={onSuccess}
            onError={onError}
          >
            <div className="flex justify-between items-center pt-8">
              <Button type="button" variant="ghost" onClick={onBack}>
                <ChevronLeft />
                {t("CheckoutEmbed.Payment.back")}
              </Button>
              <SubmitButton isValid={true} isSubmitting={false}>
                {t("CheckoutEmbed.Payment.button")}
              </SubmitButton>
            </div>
          </PaymentElement>
        )}
      </div>
    </div>
  );
}
