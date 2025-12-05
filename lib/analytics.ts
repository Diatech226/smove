// file: lib/analytics.ts
export type AnalyticsEvent = {
  name: string;
  payload?: Record<string, any>;
};

export function trackEvent(event: AnalyticsEvent): void {
  if (process.env.NODE_ENV === "development") {
    console.debug("[analytics]", event);
  }
  // Placeholder: future integration with analytics providers will be added here.
}
