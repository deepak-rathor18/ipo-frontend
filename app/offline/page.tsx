import { WifiOff } from "lucide-react";

// This route is precached by the service worker (see public/sw.js) and is
// served when a navigation fails while offline and no cached copy of the
// requested page exists yet. It intentionally renders no financial data.
export default function OfflinePage() {
  return (
    <div className="flex min-h-svh flex-col items-center justify-center gap-4 bg-background px-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-full bg-warning/10">
        <WifiOff className="size-5 text-warning" />
      </div>
      <div>
        <h1 className="text-lg font-semibold text-foreground">You&apos;re offline</h1>
        <p className="mt-1 max-w-xs text-sm text-muted-foreground">
          Reconnect to continue. Pages you&apos;ve already visited may still be
          available, but adding or editing records requires a connection.
        </p>
      </div>
    </div>
  );
}
