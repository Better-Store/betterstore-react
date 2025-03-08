import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import {
  type PaymentMethodFormData,
  paymentMethodSchema,
} from "../checkout-schema";

interface PaymentFormProps {
  initialData?: PaymentMethodFormData;
  onSubmit: (data: PaymentMethodFormData) => void;
  onBack: () => void;
  contactEmail: string;
  shippingAddress: string;
  shippingMethod: string;
  shippingPrice: string;
}

export default function PaymentForm({
  initialData,
  onSubmit,
  onBack,
  contactEmail,
  shippingAddress,
  shippingMethod,
  shippingPrice,
}: PaymentFormProps) {
  const form = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: initialData || {
      cardNumber: "",
      expiryDate: "",
      cvv: "",
      nameOnCard: "",
    },
  });

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

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="cardNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Card number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1234 5678 9012 3456"
                      className="bg-black border-gray-700 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="expiryDate"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">
                      Expiration date (MM/YY)
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="MM/YY"
                        className="bg-black border-gray-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="cvv"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Security code</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="CVV"
                        className="bg-black border-gray-700 text-white"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="nameOnCard"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-white">Name on card</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Name as it appears on card"
                      className="bg-black border-gray-700 text-white"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between items-center pt-4">
              <Button
                type="button"
                variant="link"
                className="text-blue-500 p-0 h-auto flex items-center gap-1"
                onClick={onBack}
              >
                <ChevronLeft className="h-4 w-4" />
                Return to shipping
              </Button>
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Pay now
              </Button>
            </div>
          </form>
        </Form>
      </div>
    </div>
  );
}
