import { CountryDropdown } from "@/components/compounds/form/country-dropdown";
import InputGroup from "@/components/compounds/form/input-group";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import React, { useCallback, useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { formatAddress } from "./address-utils";

export default function AddressInput() {
  const { t } = useTranslation();
  const form = useFormContext();
  const [open, setOpen] = useState(false);

  async function handleSave() {
    const isValid = form.formState.isValid;

    if (!isValid) {
      form.trigger("address");
      return;
    }

    const newAddress = form.getValues("address");
    form.setValue("address", newAddress);
    setOpen(false);
  }

  const currentValue = form.watch("address");

  const validateAddress = useCallback(async () => {
    const isAddressInvalid = form.getFieldState("address").invalid;

    if (isAddressInvalid) {
      form.setError("address", {
        message: "invalid_address",
        type: "custom",
      });
    } else {
      form.clearErrors("address");
    }
  }, [form, open]);

  useEffect(() => {
    validateAddress();
  }, [form.formState.errors.address, open]);

  return (
    <div className="w-full md:col-span-2">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="relative grid gap-2">
            <FormField
              control={form.control}
              name="address"
              render={() => (
                <FormItem>
                  <FormLabel>
                    {t("CheckoutEmbed.CustomerForm.address.address")}
                  </FormLabel>
                  <FormControl>
                    <Input
                      // {...props}
                      placeholder={t(
                        "CheckoutEmbed.CustomerForm.address.addressPlaceholder"
                      )}
                      value={
                        currentValue?.line1 ? formatAddress(currentValue) : ""
                      }
                      readOnly
                      className="cursor-pointer"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {t("CheckoutEmbed.CustomerForm.address.title")}
            </DialogTitle>
            <DialogDescription>
              {t("CheckoutEmbed.CustomerForm.address.description")}
            </DialogDescription>
          </DialogHeader>

          <div className="grid grid-cols-2 gap-4">
            <InputGroup
              className="col-span-2"
              name="address.line1"
              label={t("CheckoutEmbed.CustomerForm.address.line1")}
              placeholder={t(
                "CheckoutEmbed.CustomerForm.address.line1Placeholder"
              )}
              autoComplete="address-line1"
            />
            <InputGroup
              className="col-span-2"
              name="address.line2"
              label={t("CheckoutEmbed.CustomerForm.address.line2")}
              placeholder={t(
                "CheckoutEmbed.CustomerForm.address.line2Placeholder"
              )}
              autoComplete="address-line2"
            />

            <InputGroup
              name="address.city"
              label={t("CheckoutEmbed.CustomerForm.address.city")}
              placeholder={t(
                "CheckoutEmbed.CustomerForm.address.cityPlaceholder"
              )}
              autoComplete="address-level2"
            />
            <InputGroup
              name="address.state"
              label={t("CheckoutEmbed.CustomerForm.address.state")}
              placeholder={t(
                "CheckoutEmbed.CustomerForm.address.statePlaceholder"
              )}
              autoComplete="address-level1"
            />

            <InputGroup
              name="address.zipCode"
              label={t("CheckoutEmbed.CustomerForm.address.zipCode")}
              placeholder={t(
                "CheckoutEmbed.CustomerForm.address.zipCodePlaceholder"
              )}
              autoComplete="postal-code"
            />
            <FormField
              control={form.control}
              name="address.country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>
                    {t("CheckoutEmbed.CustomerForm.address.country")}
                  </FormLabel>
                  <CountryDropdown
                    placeholder={t(
                      "CheckoutEmbed.CustomerForm.address.countryPlaceholder"
                    )}
                    defaultValue={field.value}
                    onChange={(country) => {
                      field.onChange(country.name);
                    }}
                  />
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <DialogFooter>
            <Button onClick={handleSave} type="button">
              {t("CheckoutEmbed.CustomerForm.address.button")}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
