import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import React from "react";
import { useTranslation } from "react-i18next";

export default function CheckoutSummaryLoading() {
  const { t } = useTranslation();

  return (
    <div className="grid gap-5">
      <div className="flex justify-between items-center">
        <h2>{t("CheckoutEmbed.Summary.title")}</h2>

        <Button variant="link" asChild>
          <a>{t("CheckoutEmbed.Summary.edit")}</a>
        </Button>
      </div>

      <hr />

      <div className="grid gap-3">
        <div className="flex justify-between">
          <p>{t("CheckoutEmbed.Summary.subtotal")}</p>
          <Skeleton className="w-20 h-[18px]" />
        </div>

        <div className="flex justify-between">
          <p>{t("CheckoutEmbed.Summary.shipping")}</p>
          <Skeleton className="w-20 h-[18px]" />
        </div>

        <div className="flex font-bold justify-between  items-center">
          <p>{t("CheckoutEmbed.Summary.total")}</p>
          <Skeleton className="w-24 h-[18px]" />
        </div>
      </div>

      <hr />

      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="flex items-center mb-6">
          <Skeleton className="rounded-lg size-16" />

          <div className="ml-4 grid gap-2 flex-1">
            <Skeleton className="w-28 h-5" />
            <Skeleton className="w-20 h-3.5" />
          </div>

          <div className="text-right">
            <Skeleton className="w-20 h-5" />
          </div>
        </div>
      ))}
    </div>
  );
}
