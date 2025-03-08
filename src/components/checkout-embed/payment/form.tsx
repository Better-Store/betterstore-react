import PaymentElement from "@/components/payment-element";
import { Button } from "@/components/ui/button";
import React from "react";

interface PaymentFormProps {
  paymentSecret: string | null;
  onSubmit: (data: any) => void;
  onBack: () => void;
  contactEmail: string;
  shippingAddress: string;
  shippingMethod: string;
  shippingPrice: string;
}

export default function PaymentForm({
  paymentSecret,
  onSubmit,
  onBack,
  contactEmail,
  shippingAddress,
  shippingMethod,
  shippingPrice,
}: PaymentFormProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Payment</h2>
          <p className="text-sm text-gray-400">
            All transactions are secure and encrypted.
          </p>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="text-white">
            <span>Contact</span>
            <span className="ml-2 text-gray-400">{contactEmail}</span>
          </div>
          <Button
            variant="link"
            className="text-blue-500 p-0 h-auto"
            onClick={onBack}
          >
            Change
          </Button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="text-white">
            <span>Ship to</span>
            <span className="ml-2 text-gray-400">{shippingAddress}</span>
          </div>
          <Button
            variant="link"
            className="text-blue-500 p-0 h-auto"
            onClick={onBack}
          >
            Change
          </Button>
        </div>

        <div className="flex items-center justify-between text-sm">
          <div className="text-white">
            <span>Shipping method</span>
            <span className="ml-2 text-gray-400">
              {shippingMethod} · {shippingPrice}
            </span>
          </div>
          <Button
            variant="link"
            className="text-blue-500 p-0 h-auto"
            onClick={onBack}
          >
            Change
          </Button>
        </div>
      </div>

      <div className="space-y-4 bg-gray-900 p-4 rounded-md">
        <div className="text-white font-medium">Payment method</div>

        {paymentSecret && (
          <PaymentElement paymentSecret={paymentSecret}>
            <button>Submit</button>
          </PaymentElement>
        )}
      </div>
    </div>
  );
}
