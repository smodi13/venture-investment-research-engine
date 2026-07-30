"use client";

import { createContext, useCallback, useContext, useMemo } from "react";
import {
  DEFAULT_MANDATE_ID,
  getMandate,
  isMandateId,
  type Mandate,
  type MandateId,
} from "@/lib/mandates";
import { storeMandate, useStoredMandate } from "@/lib/storage";

interface MandateContextValue {
  mandateId: MandateId;
  mandate: Mandate;
  setMandateId: (id: MandateId) => void;
}

const MandateContext = createContext<MandateContextValue | null>(null);

/**
 * The active mandate.
 *
 * Held in local storage and read through useSyncExternalStore, so the server
 * renders the default mandate, hydration matches, and the stored preference is
 * applied in the same commit rather than through a follow-up render.
 */
export function MandateProvider({ children }: { children: React.ReactNode }) {
  const stored = useStoredMandate();
  const mandateId =
    stored && isMandateId(stored) ? stored : DEFAULT_MANDATE_ID;

  const setMandateId = useCallback((id: MandateId) => storeMandate(id), []);

  const value = useMemo(
    () => ({ mandateId, mandate: getMandate(mandateId), setMandateId }),
    [mandateId, setMandateId],
  );

  return (
    <MandateContext.Provider value={value}>{children}</MandateContext.Provider>
  );
}

export function useMandate(): MandateContextValue {
  const ctx = useContext(MandateContext);
  if (!ctx) {
    throw new Error("useMandate must be used inside a MandateProvider");
  }
  return ctx;
}
