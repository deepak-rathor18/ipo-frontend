"use client";

import * as React from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/providers/auth-provider";
import { AppShell } from "@/components/layout/app-shell";

export default function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && !user) {
      router.replace("/login");
    }
  }, [isLoading, user, router]);

  if (isLoading) {
    return (
      <div className="flex min-h-svh items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold">
            F
          </div>
          <p className="text-sm text-muted-foreground">Loading FinTrack…</p>
        </div>
      </div>
    );
  }

  if (!user) {
    // Redirect effect is in flight; render nothing to avoid a flash of protected UI.
    return null;
  }

  return <AppShell>{children}</AppShell>;
}
