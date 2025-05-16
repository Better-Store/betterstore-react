import clsx from "clsx";
import React from "react";
import { useTranslation } from "react-i18next";
import { Skeleton } from "../ui/skeleton";

export default function CheckoutFormLoading() {
  const { t } = useTranslation();

  return (
    <div className="md:grid-cols-2 gap-6 grid">
      <div className="md:col-span-2">
        <h2>{t("CheckoutEmbed.CustomerForm.title")}</h2>
      </div>

      <InputGroupLoading className="md:col-span-2" />
      <InputGroupLoading />
      <InputGroupLoading />
      <InputGroupLoading className="md:col-span-2" />
      <InputGroupLoading />

      <div className="flex md:col-span-2 justify-end pt-2">
        <Skeleton className="w-32 h-10" />
      </div>
    </div>
  );
}

function InputGroupLoading({ className }: { className?: string }) {
  return (
    <div className={clsx("flex flex-col gap-2", className)}>
      <Skeleton className="w-10 h-3" />
      <Skeleton className="w-full h-10" />
    </div>
  );
}
