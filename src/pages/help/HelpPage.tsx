"use client";

import { useState, useEffect, useRef } from "react";
import {
  Truck,
  RefreshCcw,
  MapPin,
  FileText,
  Shield,
  XCircle,
  MessageCircle,
  ChevronRight,
  Phone,
  Mail,
  Clock,
} from "lucide-react";
import Header from "../home/components/Header";
import Footer from "../home/components/Footer";

// ─── Data ────────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "shipping", label: "Shipping Policy", icon: Truck },
  { id: "exchange", label: "Exchange Policy", icon: RefreshCcw },
  { id: "track", label: "Track My Order", icon: MapPin },
  { id: "terms", label: "Terms & Conditions", icon: FileText },
  { id: "privacy", label: "Privacy Policy", icon: Shield },
  { id: "cancellation", label: "Cancellation Policy", icon: XCircle },
];

const SECTIONS = [
  {
    id: "shipping",
    icon: Truck,
    title: "Shipping Policy",
    points: [
      "Orders are processed within 24–48 hours.",
      "Delivery time: 3–5 working days across India, depending on your pin code.",
      "Free shipping on orders above ₹999.",
      "₹70 shipping charge for orders below ₹499.",
      "You will receive a tracking link after dispatch.",
    ],
  },
  {
    id: "exchange",
    icon: RefreshCcw,
    title: "Exchange Policy",
    points: [
      "We do not offer refunds under any circumstances.",
      "Exchange is available only for size issues or damaged products. Opening video is mandatory for damaged product claims.",
      "Exchange request must be raised within 3 days of delivery.",
      "Product must be unused, unwashed, with tags intact.",
      "Reverse pickup available depending on location.",
      "Only one-time exchange is allowed per order.",
    ],
  },
  {
    id: "track",
    icon: MapPin,
    title: "Track My Order",
    points: [
      "Use the tracking link sent via SMS/email after dispatch.",
      "Enter your order ID to check the current status.",
      "For delays beyond the expected window, contact our support team.",
    ],
    quote:
      "We ensure every product is carefully quality-checked and securely packed before dispatch.",
  },
  {
    id: "terms",
    icon: FileText,
    title: "Terms & Conditions",
    points: [
      "By accessing and using this website, you agree to comply with all applicable policies and terms.",
      "All product prices and availability are subject to change without prior notice.",
      "SHADES reserves the right to cancel or refuse any order at its discretion.",
      "In case of any issues related to orders, our decision will be considered final.",
    ],
  },
  {
    id: "privacy",
    icon: Shield,
    title: "Privacy Policy",
    points: [
      "We respect and protect your privacy at all times.",
      "All customer information is securely stored and never shared with third parties.",
      "Payments are processed through trusted and secure payment gateways.",
      "Your personal details are used only for order processing and communication purposes.",
    ],
  },
  {
    id: "cancellation",
    icon: XCircle,
    title: "Cancellation Policy",
    points: [
      "Orders can be cancelled only before dispatch.",
      "Once the order is shipped, cancellation is not possible.",
      "As per our policy, we do not offer refunds — only exchange is available.",
    ],
  },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────

const GOLD = "#C6A46C";
const GOLD_LIGHT = "#C6A46C18";
const GOLD_MID = "#C6A46C35";

// ─── Sub-components ───────────────────────────────────────────────────────────

function SectionCard({
  section,
  isActive,
}: {
  section: (typeof SECTIONS)[0];
  isActive: boolean;
}) {
  const Icon = section.icon;
  return (
    <div
      id={section.id}
      className="scroll-mt-28 rounded-2xl border transition-all duration-300"
      style={{
        borderColor: isActive ? GOLD_MID : "rgba(0,0,0,0.07)",
        background: isActive ? GOLD_LIGHT : "white",
      }}
    >
      {/* Card Header */}
      <div
        className="flex items-center gap-3 px-6 py-5 border-b"
        style={{ borderColor: isActive ? GOLD_MID : "rgba(0,0,0,0.06)" }}
      >
        <span
          className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: isActive ? GOLD : "rgba(198,164,108,0.12)" }}
        >
          <Icon
            size={16}
            style={{ color: isActive ? "white" : GOLD }}
            strokeWidth={1.8}
          />
        </span>
        <h2
          className="text-base font-medium tracking-wide"
          style={{
            fontFamily: "'Cormorant Garamond', Georgia, serif",
            fontSize: "1.15rem",
            color: isActive ? "#3a2c1a" : "#1a1a1a",
          }}
        >
          {section.title}
        </h2>
      </div>

      {/* Card Body */}
      <div className="px-6 py-5 space-y-3">
        {section.points.map((point, i) => (
          <div key={i} className="flex items-start gap-3">
            <span
              className="mt-[6px] w-1.5 h-1.5 rounded-full flex-shrink-0"
              style={{ background: GOLD }}
            />
            <p className="text-sm leading-relaxed" style={{ color: "#4a4a4a" }}>
              {point}
            </p>
          </div>
        ))}

        {section.quote && (
          <blockquote
            className="mt-4 pl-4 py-3 text-sm italic leading-relaxed rounded-r-lg"
            style={{
              borderLeft: `3px solid ${GOLD}`,
              color: "#7a6a50",
              background: "rgba(198,164,108,0.06)",
            }}
          >
            "{section.quote}"
          </blockquote>
        )}
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

export default function HelpPage() {
  const [activeSection, setActiveSection] = useState("shipping");
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Highlight nav item as user scrolls
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActiveSection(entry.target.id);
        });
      },
      { rootMargin: "-30% 0px -60% 0px", threshold: 0 },
    );

    SECTIONS.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className="min-h-screen"
      style={{ background: "#FAFAF7", fontFamily: "'DM Sans', sans-serif" }}
    >
      <Header />

      {/* Google Fonts */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,400&family=DM+Sans:wght@300;400;500&display=swap');
      `}</style>

      {/* ── Page Header ── */}
      <div
        className="border-b"
        style={{ borderColor: "rgba(198,164,108,0.2)", background: "white" }}
      >
        <div className="max-w-5xl mx-auto px-5 py-10">
          <div className="flex items-center gap-2 mb-3">
            <div className="h-px w-6" style={{ background: GOLD }} />
            <span
              className="text-xs tracking-[0.2em] uppercase font-medium"
              style={{ color: GOLD }}
            >
              Support
            </span>
          </div>
          <h1
            className="text-4xl font-normal mb-2"
            style={{
              fontFamily: "'Cormorant Garamond', Georgia, serif",
              color: "#1a1a1a",
              letterSpacing: "0.04em",
            }}
          >
            Help Centre
          </h1>
          <p className="text-sm" style={{ color: "#888", fontWeight: 300 }}>
            Everything you need to know about orders, shipping, and policies.
          </p>
        </div>
      </div>

      {/* ── Body: Sidebar + Content ── */}
      <div className="max-w-5xl mx-auto px-5 py-10 flex gap-8 items-start">
        {/* Sticky Sidebar */}
        <aside className="hidden lg:flex flex-col gap-1 sticky top-24 w-56 flex-shrink-0">
          <p
            className="text-[10px] tracking-[0.18em] uppercase mb-3 pl-3"
            style={{ color: "#aaa" }}
          >
            Sections
          </p>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => {
            const active = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-left transition-all duration-200 group"
                style={{
                  background: active ? GOLD_LIGHT : "transparent",
                  borderLeft: active
                    ? `2px solid ${GOLD}`
                    : "2px solid transparent",
                }}
              >
                <Icon
                  size={13}
                  strokeWidth={active ? 2 : 1.5}
                  style={{
                    color: active ? GOLD : "#aaa",
                    transition: "color 0.2s",
                  }}
                />
                <span
                  className="text-xs tracking-wide transition-colors duration-200"
                  style={{
                    color: active ? "#3a2c1a" : "#777",
                    fontWeight: active ? 500 : 400,
                  }}
                >
                  {label}
                </span>
                {active && (
                  <ChevronRight
                    size={10}
                    className="ml-auto"
                    style={{ color: GOLD }}
                  />
                )}
              </button>
            );
          })}

          {/* Contact Card in sidebar */}
          <div
            className="mt-6 rounded-xl p-4"
            style={{ background: GOLD_LIGHT, border: `1px solid ${GOLD_MID}` }}
          >
            <div className="flex items-center gap-1.5 mb-3">
              <MessageCircle size={12} style={{ color: GOLD }} />
              <span
                className="text-[10px] tracking-widest uppercase font-medium"
                style={{ color: GOLD }}
              >
                Need Help?
              </span>
            </div>
            <div className="space-y-2">
              <a
                href="mailto:shadesoriginals.info@gmail.com"
                className="flex items-center gap-2 text-xs hover:underline"
                style={{ color: "#5a4a30" }}
              >
                <Mail size={11} style={{ color: GOLD }} />
                shadesoriginals.info
              </a>
              <a
                href="https://wa.me/918548995696"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 text-xs hover:underline"
                style={{ color: "#5a4a30" }}
              >
                <Phone size={11} style={{ color: GOLD }} />
                +91 85489 95696
              </a>
              <div className="flex items-center gap-2 text-xs text-gray-500">
                <Clock size={11} style={{ color: GOLD }} />
                10 AM – 6:30 PM
              </div>
            </div>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 space-y-5">
          {SECTIONS.map((section) => (
            <SectionCard
              key={section.id}
              section={section}
              isActive={activeSection === section.id}
            />
          ))}

          {/* ── Contact Banner ── */}
          <div
            className="rounded-2xl p-6 mt-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5"
            style={{
              background: `linear-gradient(135deg, #3a2c1a 0%, #5a4228 100%)`,
            }}
          >
            <div>
              <p
                className="text-lg font-normal mb-1"
                style={{
                  fontFamily: "'Cormorant Garamond', Georgia, serif",
                  color: GOLD,
                  letterSpacing: "0.04em",
                }}
              >
                Still need help?
              </p>
              <p className="text-xs text-gray-300">
                Our team is available 10 AM – 6:30 PM, Mon–Sat.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <a
                href="mailto:shadesoriginals.info@gmail.com"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all"
                style={{
                  background: "rgba(198,164,108,0.15)",
                  color: GOLD,
                  border: `1px solid rgba(198,164,108,0.3)`,
                }}
              >
                <Mail size={12} />
                Email Us
              </a>
              <a
                href="https://wa.me/918548995696"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-2 px-4 py-2 rounded-full text-xs font-medium transition-all"
                style={{
                  background: GOLD,
                  color: "#3a2c1a",
                }}
              >
                <MessageCircle size={12} />
                WhatsApp
              </a>
            </div>
          </div>
        </main>
      </div>

      <Footer />
    </div>
  );
}
