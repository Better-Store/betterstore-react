import { storeHelpers } from "@/lib/betterstore";
import {
  CheckoutSession,
  createStoreClient,
  ShippingRate,
} from "@betterstore/sdk";
import { StripeElementLocale, StripeElementsOptions } from "@stripe/stripe-js";
import { AnimatePresence, motion, MotionProps } from "motion/react";
import React, { useCallback, useEffect, useState } from "react";
import { AppearanceConfig } from "./appearance";
import {
  customerSchema,
  shippingMethodSchema,
  type CheckoutFormData,
  type CustomerFormData,
  type ShippingMethodFormData,
} from "./checkout-schema";
import { formatAddress } from "./steps/customer/address-utils";
import CustomerForm from "./steps/customer/form";
import PaymentForm from "./steps/payment/form";
import ShippingMethodForm from "./steps/shipping/form";
import { useFormStore } from "./useFormStore";

interface CheckoutFormProps {
  storeClient: ReturnType<typeof createStoreClient>;
  checkoutId: string;
  onSuccess: () => void;
  onError: () => void;
  cancelUrl: string;
  clientSecret: string;
  customer?: CheckoutSession["customer"];
  currency: string;
  checkoutAppearance?: AppearanceConfig;
  fonts?: StripeElementsOptions["fonts"];
  locale?: StripeElementLocale;
  setShippingCost: (cost: number) => void;
  exchangeRate: number;
}

const motionSettings = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2 },
} satisfies MotionProps;

export default function CheckoutForm({
  storeClient,
  checkoutId,
  onSuccess,
  onError,
  cancelUrl,
  clientSecret,
  customer,
  currency,
  checkoutAppearance,
  fonts,
  locale,
  setShippingCost,
  exchangeRate,
}: CheckoutFormProps) {
  const {
    formData,
    setFormData,
    step,
    setStep,
    checkoutId: storedCheckoutId,
    setCheckoutId,
  } = useFormStore();
  const [paymentSecret, setPaymentSecret] = useState<string | null>(null);
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [shippingRates, setShippingRates] = useState<ShippingRate[]>([]);

  const validateStep = useCallback(() => {
    if (step === "customer") return;

    const isShippingValid =
      formData.shipping &&
      shippingMethodSchema.safeParse(formData.shipping).success;
    const isCustomerValid =
      formData.customer && customerSchema.safeParse(formData.customer).success;

    if (step === "shipping" && !isCustomerValid) {
      setStep("customer");
    }
    if (step === "payment") {
      if (!isShippingValid) setStep("shipping");
      if (!isCustomerValid) setStep("customer");
    }
  }, [step, formData]);

  useEffect(() => {
    validateStep();
  }, [step]);

  useEffect(() => {
    if (checkoutId !== storedCheckoutId) {
      setStep("customer");
      setCheckoutId(checkoutId);

      if (customer) {
        setFormData({
          customerId: customer.id,
          customer: {
            firstName: customer.address?.name?.split(" ")[0] ?? "",
            lastName: customer.address?.name?.split(" ")[1] ?? "",
            phone: customer.address?.phone ?? "",
            email: customer.email ?? "",
            address: {
              line1: customer.address?.line1 ?? "",
              line2: customer.address?.line2 ?? "",
              city: customer.address?.city ?? "",
              zipCode: customer.address?.zipCode ?? "",
              country: customer.address?.country ?? "",
              countryCode: customer.address?.countryCode ?? "",
            },
          },
        });
      } else if (formData.customer?.email) {
        setFormData({
          customer: formData.customer,
        });
      } else {
        setFormData({});
      }

      return;
    }

    if (customer && !formData.customer?.email) {
      const step = customer.id ? "shipping" : "customer";

      setFormData({
        ...formData,
        customerId: customer.id,
        customer: {
          firstName: customer.address?.name?.split(" ")[0] ?? "",
          lastName: customer.address?.name?.split(" ")[1] ?? "",
          phone: customer.address?.phone ?? "",
          email: customer.email ?? "",
          address: {
            line1: customer.address?.line1 ?? "",
            line2: customer.address?.line2 ?? "",
            city: customer.address?.city ?? "",
            zipCode: customer.address?.zipCode ?? "",
            country: customer.address?.country ?? "",
            countryCode: customer.address?.countryCode ?? "",
          },
        },
      });
      setStep(step);
    }
  }, [customer]);

  useEffect(() => {
    if (step !== "shipping") return;
    if (shippingRates.length > 0) return;

    const getShippingRates = async () => {
      try {
        const shippingRates = await storeClient.getCheckoutShippingRates(
          clientSecret,
          checkoutId
        );
        setShippingRates(shippingRates);
      } catch (error) {
        console.error("Failed to load shipping rates:", error);
        setShippingRates([]);
      }
    };

    getShippingRates();
  }, [step, clientSecret, checkoutId]);

  // Handle address form submission
  const handleCustomerSubmit = async (data: CustomerFormData) => {
    setFormData({
      ...formData,
      customer: data,
    });

    let newCustomerId = formData.customerId;

    if (!newCustomerId) {
      const newCustomer = await storeClient.createCustomer(clientSecret, {
        email: data.email,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        address: {
          ...data.address,
          phone: data.phone,
          name: data.firstName + " " + data.lastName,
        },
      });

      await storeClient.updateCheckout(clientSecret, checkoutId, {
        customerId: newCustomer.id,
      });
      newCustomerId = newCustomer.id;
    } else {
      await storeClient.updateCustomer(clientSecret, newCustomerId, {
        email: data.email,
        phone: data.phone,
        firstName: data.firstName,
        lastName: data.lastName,
        address: {
          ...data.address,
          phone: data.phone,
          name: data.firstName + " " + data.lastName,
        },
      });
    }

    const shippingRates = await storeClient.getCheckoutShippingRates(
      clientSecret,
      checkoutId
    );
    setShippingRates(shippingRates);

    setFormData({
      ...formData,
      customer: data,
      customerId: newCustomerId,
    });
    setStep("shipping");
  };

  // Handle shipping method form submission
  const handleShippingSubmit = async (data: ShippingMethodFormData) => {
    const newFormData = {
      ...formData,
      shipping: data,
    } as CheckoutFormData;

    setFormData(newFormData);

    await storeClient.updateCheckout(clientSecret, checkoutId, {
      shipmentData: {
        provider: data.provider,
        pickupPointId: data.pickupPointId,
      },
    });
    const { paymentSecret, publicKey } =
      await storeClient.generateCheckoutsPaymentSecret(
        clientSecret,
        checkoutId
      );

    setPaymentSecret(paymentSecret);
    setPublicKey(publicKey);
    setShippingCost(data.price);

    setStep("payment");
  };

  // Navigate back to previous step
  const handleBack = () => {
    if (step === "customer") {
      window.location.replace(cancelUrl);
    }
    if (step === "shipping") setStep("customer");
    if (step === "payment") setStep("shipping");
  };

  const handleDoubleBack = () => {
    setStep("customer");
  };

  useEffect(() => {
    const asyncFunc = async () => {
      const { paymentSecret, publicKey } =
        await storeClient.generateCheckoutsPaymentSecret(
          clientSecret,
          checkoutId
        );
      setPaymentSecret(paymentSecret);
      setPublicKey(publicKey);
    };

    if (!paymentSecret && step === "payment") {
      asyncFunc();
    }
  }, [paymentSecret]);

  return (
    <div className="relative min-h-full w-full">
      <AnimatePresence mode="wait">
        {step === "customer" && (
          <motion.div
            key="customer"
            {...motionSettings}
            className="absolute w-full"
          >
            <CustomerForm
              initialData={formData.customer}
              onSubmit={handleCustomerSubmit}
            />
          </motion.div>
        )}

        {step === "shipping" && formData.customer && (
          <motion.div
            key="shipping"
            {...motionSettings}
            className="absolute w-full"
          >
            <ShippingMethodForm
              setFormData={setFormData}
              formData={formData}
              shippingRates={shippingRates}
              initialData={formData.shipping}
              onSubmit={handleShippingSubmit}
              onBack={handleBack}
              contactEmail={formData.customer.email}
              shippingAddress={formatAddress(formData.customer.address)}
              currency={currency}
              exchangeRate={exchangeRate}
              locale={locale}
              countryCode={formData.customer.address.countryCode}
            />
          </motion.div>
        )}

        {step === "payment" && formData.customer && formData.shipping && (
          <motion.div
            key="payment"
            {...motionSettings}
            className="absolute w-full"
          >
            <PaymentForm
              locale={locale}
              fonts={fonts}
              checkoutAppearance={checkoutAppearance}
              paymentSecret={paymentSecret}
              onSuccess={onSuccess}
              onError={onError}
              onBack={handleBack}
              onDoubleBack={handleDoubleBack}
              contactEmail={formData.customer.email}
              shippingAddress={formatAddress(formData.customer.address)}
              shippingName={formData.shipping.name}
              shippingPrice={storeHelpers.formatPrice(
                formData.shipping.price,
                currency,
                exchangeRate
              )}
              publicKey={publicKey}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
