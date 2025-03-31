"use client";

import { SessionProvider } from "next-auth/react";
import { ReactNode, useEffect, useState } from "react";

export function NextAuthProvider({ children }: { children: ReactNode }) {
  // Use state to hydrate properly and avoid hydration mismatch
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
} 