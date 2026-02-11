export type EventName =
  | "select_model"
  | "select_channel"
  | "select_plan"
  | "click_pay"
  | "click_waitlist";

export function trackEvent(event: EventName, payload: Record<string, string | number | boolean>): void {
  if (typeof window === "undefined") {
    return;
  }

  const dataLayer = (window as Window & { dataLayer?: Array<Record<string, unknown>> }).dataLayer;
  if (Array.isArray(dataLayer)) {
    dataLayer.push({ event, ...payload });
  }

  if (process.env.NODE_ENV !== "production") {
    // Keep local behavior visible for quick QA without analytics setup.
    console.info(`[track] ${event}`, payload);
  }
}
