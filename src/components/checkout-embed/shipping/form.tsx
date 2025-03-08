import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronLeft } from "lucide-react";
import React from "react";
import { useForm } from "react-hook-form";
import {
  type ShippingMethodFormData,
  shippingMethodSchema,
} from "../checkout-schema";

interface ShippingMethodFormProps {
  initialData?: ShippingMethodFormData;
  onSubmit: (data: ShippingMethodFormData) => void;
  onBack: () => void;
  contactEmail: string;
  shippingAddress: string;
}

export default function ShippingMethodForm({
  initialData,
  onSubmit,
  onBack,
  contactEmail,
  shippingAddress,
}: ShippingMethodFormProps) {
  const form = useForm<ShippingMethodFormData>({
    resolver: zodResolver(shippingMethodSchema),
    defaultValues: initialData || {
      method: "economy",
    },
  });

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-white">Shipping method</h2>
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
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="method"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="space-y-3"
                  >
                    <FormItem className="flex items-center justify-between space-x-3 space-y-0 rounded-md border border-gray-700 p-4 cursor-pointer data-[state=checked]:border-blue-600">
                      <div className="flex items-center space-x-3">
                        <FormControl>
                          <RadioGroupItem
                            value="economy"
                            className="data-[state=checked]:border-blue-600 data-[state=checked]:text-blue-600"
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="text-white">Economy</FormLabel>
                          <div className="text-sm text-gray-400">
                            5 to 8 business days
                          </div>
                        </div>
                      </div>
                      <div className="text-white font-medium">$4.90</div>
                    </FormItem>

                    <FormItem className="flex items-center justify-between space-x-3 space-y-0 rounded-md border border-gray-700 p-4 cursor-pointer data-[state=checked]:border-blue-600">
                      <div className="flex items-center space-x-3">
                        <FormControl>
                          <RadioGroupItem
                            value="standard"
                            className="data-[state=checked]:border-blue-600 data-[state=checked]:text-blue-600"
                          />
                        </FormControl>
                        <div className="space-y-1">
                          <FormLabel className="text-white">Standard</FormLabel>
                          <div className="text-sm text-gray-400">
                            3 to 4 business days
                          </div>
                        </div>
                      </div>
                      <div className="text-white font-medium">$6.90</div>
                    </FormItem>
                  </RadioGroup>
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
              Return to information
            </Button>
            <Button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Continue to payment
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
}
