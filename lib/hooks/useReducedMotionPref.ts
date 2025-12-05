// file: lib/hooks/useReducedMotionPref.ts
"use client";

import { useEffect, useState } from "react";
import { useReducedMotion } from "framer-motion";

export function useReducedMotionPref(): boolean {
  const prefersReducedMotion = useReducedMotion();
  const [systemPreference, setSystemPreference] = useState<boolean | null>(null);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updatePreference = () => setSystemPreference(mediaQuery.matches);

    updatePreference();
    mediaQuery.addEventListener("change", updatePreference);

    return () => mediaQuery.removeEventListener("change", updatePreference);
  }, []);

  return Boolean(prefersReducedMotion ?? systemPreference ?? false);
}
