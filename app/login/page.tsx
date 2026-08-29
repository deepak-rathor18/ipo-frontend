"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { TrendingUp } from "lucide-react";

import { useAuth } from "@/providers/auth-provider";
import { LoginForm } from "@/components/auth/login-form";

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  React.useEffect(() => {
    if (!isLoading && user) {
      router.replace("/dashboard");
    }
  }, [isLoading, user, router]);

  return (
    <div className="grid min-h-svh lg:grid-cols-2">
      {/* Form panel */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-10 md:px-16 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <div className="mb-10 flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <TrendingUp className="size-5" />
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              FinTrack
            </span>
          </div>

          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Welcome back
          </h1>
          <p className="mt-1.5 text-sm text-muted-foreground">
            Sign in to track IPO applications and shared money records.
          </p>

          <div className="mt-8">
            <LoginForm />
          </div>
        </div>
      </div>

      {/* Signature panel — abstract candlestick / ledger rhythm, quiet and on-brand */}
      <div className="relative hidden overflow-hidden bg-primary lg:block">
        <div className="absolute inset-0 flex flex-col justify-between p-12">
          <div className="text-primary-foreground/90">
            <p className="text-sm font-medium tracking-wide uppercase text-primary-foreground/60">
              FinTrack
            </p>
            <p className="mt-4 max-w-xs text-2xl font-medium leading-snug text-white">
              One shared ledger for every IPO application and every rupee moved.
            </p>
          </div>

          <svg
            viewBox="0 0 400 160"
            className="w-full max-w-md text-white/90"
            fill="none"
            aria-hidden="true"
          >
            {[
              { x: 10, h: 60, up: true },
              { x: 40, h: 90, up: true },
              { x: 70, h: 40, up: false },
              { x: 100, h: 110, up: true },
              { x: 130, h: 70, up: false },
              { x: 160, h: 130, up: true },
              { x: 190, h: 55, up: false },
              { x: 220, h: 100, up: true },
              { x: 250, h: 75, up: true },
              { x: 280, h: 45, up: false },
              { x: 310, h: 120, up: true },
              { x: 340, h: 85, up: true },
              { x: 370, h: 60, up: false },
            ].map((bar, i) => (
              <rect
                key={i}
                x={bar.x}
                y={150 - bar.h}
                width="18"
                height={bar.h}
                rx="2"
                fill={bar.up ? "currentColor" : "white"}
                opacity={bar.up ? 0.95 : 0.35}
              />
            ))}
          </svg>

          <div className="flex gap-8 text-primary-foreground/80">
            <div>
              <p className="text-2xl font-semibold text-white">Shared</p>
              <p className="text-sm text-primary-foreground/70">Deepak &amp; Aman, one ledger</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-white">Secure</p>
              <p className="text-sm text-primary-foreground/70">HTTP-only cookie session</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
