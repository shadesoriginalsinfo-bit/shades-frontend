import { useCallback, useEffect, useRef } from "react";

declare global {
  interface Window {
    Razorpay: new (options: RazorpayOptions) => RazorpayInstance;
  }
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name?: string;
  description?: string;
  image?: string;
  prefill?: { name?: string; email?: string; contact?: string };
  theme?: { color?: string };
  handler: (response: RazorpayResponse) => void;
  modal?: { ondismiss?: () => void };
}

export interface RazorpayResponse {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}

interface RazorpayInstance {
  open(): void;
  close(): void;
}

const RAZORPAY_SCRIPT_URL = "https://checkout.razorpay.com/v1/checkout.js";

function loadRazorpayScript(): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.Razorpay) {
      resolve();
      return;
    }
    const existing = document.querySelector(`script[src="${RAZORPAY_SCRIPT_URL}"]`);
    if (existing) {
      existing.addEventListener("load", () => resolve());
      existing.addEventListener("error", () => reject(new Error("Failed to load Razorpay")));
      return;
    }
    const script = document.createElement("script");
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Failed to load Razorpay"));
    document.body.appendChild(script);
  });
}

export function useRazorpay() {
  const instanceRef = useRef<RazorpayInstance | null>(null);

  useEffect(() => {
    loadRazorpayScript().catch(console.error);
    return () => {
      instanceRef.current?.close();
    };
  }, []);

  const openRazorpay = useCallback(
    async (options: RazorpayOptions): Promise<void> => {
      await loadRazorpayScript();
      instanceRef.current?.close();
      instanceRef.current = new window.Razorpay(options);
      instanceRef.current.open();
    },
    [],
  );

  return { openRazorpay };
}
