"use client";

import { PageHeader } from "@/components/shared/page-header";
import { MoneyForm } from "@/components/money/money-form";

export default function NewMoneyPage() {
  return (
    <div>
      <PageHeader
        title="Add Transaction"
        description="Record money given or borrowed to the shared ledger."
      />
      <MoneyForm />
    </div>
  );
}
