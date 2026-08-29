"use client";

import { PageHeader } from "@/components/shared/page-header";
import { IpoForm } from "@/components/ipo/ipo-form";

export default function NewIpoPage() {
  return (
    <div>
      <PageHeader
        title="Add IPO"
        description="Record a new IPO application to the shared ledger."
      />
      <IpoForm />
    </div>
  );
}
