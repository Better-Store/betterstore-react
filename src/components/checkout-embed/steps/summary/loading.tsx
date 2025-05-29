import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { ChevronDown } from "lucide-react";
import React from "react";
import { useTranslation } from "react-i18next";

export default function CheckoutSummaryLoading() {
  const { t } = useTranslation();

  return (
    <div className="grid gap-5">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2 cursor-pointer">
          <h2>{t("CheckoutEmbed.Summary.title")}</h2>
          <ChevronDown className="md:hidden size-5 transition-transform" />
        </div>

        <Skeleton className="w-20 h-[20px] md:hidden" />
        <Button className="max-sm:hidden" variant="link" size="link" asChild>
          <a>{t("CheckoutEmbed.Summary.edit")}</a>
        </Button>
      </div>

      <hr />

      <div className="hidden md:grid gap-2">
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

      <hr className="hidden md:block" />

      <div>
        <Skeleton className="w-24 h-5 mb-2" />
        <Skeleton className="h-10 w-full mb-1" />
      </div>

      <hr className="hidden md:block" />

      {Array.from({ length: 2 }).map((_, index) => (
        <div key={index} className="hidden md:flex items-center">
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
