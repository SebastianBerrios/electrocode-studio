"use client";

import { createContext, useContext, ReactNode } from "react";
import type { InvitationConfig } from "@/lib/clients/types";

const InvitationContext = createContext<InvitationConfig | null>(null);

export function InvitationProvider({
  value,
  children,
}: {
  value: InvitationConfig;
  children: ReactNode;
}) {
  return (
    <InvitationContext.Provider value={value}>
      {children}
    </InvitationContext.Provider>
  );
}

export function useInvitation(): InvitationConfig {
  const context = useContext(InvitationContext);
  if (!context) {
    throw new Error("useInvitation must be used within an InvitationProvider");
  }
  return context;
}
