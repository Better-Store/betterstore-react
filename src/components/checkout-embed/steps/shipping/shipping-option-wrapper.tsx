import { ShippingRate } from "@betterstore/sdk";
import React from "react";
import ZasilkovnaShippingOption from "./providers/zasilkovna";

export default function ShippingOptionWrapper({
  rate,
  children,
  onPickupPointSelected,
  locale,
  countryCode,
}: {
  rate: ShippingRate;
  children: React.ReactNode;
  onPickupPointSelected?: (pickupPointId: string) => void;
  locale?: string;
  countryCode?: string;
}) {
  if (rate.provider === "zasilkovna") {
    return (
      <ZasilkovnaShippingOption
        onPickupPointSelected={onPickupPointSelected}
        locale={locale}
        countryCode={countryCode}
        apiKey={rate.clientSecret}
      >
        {children}
      </ZasilkovnaShippingOption>
    );
  }

  return;
}
