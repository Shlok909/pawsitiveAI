
"use client";
import { ClientAppLayout } from "./client-layout";
import { useEffect, useState } from "react";

export default function AppLayout({ children }: { children: React.ReactNode }) {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Render the ClientAppLayout only on the client-side to avoid hydration mismatch
  return isClient ? <ClientAppLayout>{children}</ClientAppLayout> : null;
}
