import { useState } from "react";
import { Plus, Minus, ShoppingBag } from "lucide-react";

const faqs = [
  {
    category: "Shipping",
    items: [
      {
        q: "What is the delivery time?",
        a: "Delivery takes 3–5 working days depending on your location. We ensure your order is dispatched promptly once placed.",
      },
      {
        q: "Can I cancel my order?",
        a: "Orders can be cancelled only before dispatch. Once your order has been shipped, cancellation is no longer possible.",
      },
    ],
  },
  {
    category: "Payment",
    items: [
      {
        q: "Do you offer Cash on Delivery (COD)?",
        a: "No, we currently do not offer Cash on Delivery. All payments must be made online at checkout.",
      },
    ],
  },
  {
    category: "Sizing & Product",
    items: [
      {
        q: "How do I choose the right size?",
        a: "Please refer to our size guide before placing your order to ensure the perfect fit. Each product page includes a detailed size chart.",
      },
      {
        q: "What is the fabric quality?",
        a: "We use premium quality fabrics designed for comfort and durability — crafted to look and feel great through everyday wear.",
      },
    ],
  },
  {
    category: "Exchange & Refunds",
    items: [
      {
        q: "Can I exchange my product?",
        a: "Yes, exchange is available for size issues or damaged products within 3–5 days of delivery. Please ensure the product is unused and in original condition.",
      },
      {
        q: "Do you offer refunds?",
        a: "We currently offer exchange only — no cash refunds. We strive to resolve all concerns through a smooth exchange process.",
      },
      {
        q: "How do I request an exchange?",
        a: "You can contact our support team via WhatsApp or email with your order details and reason for exchange. We'll guide you through the process.",
      },
      {
        q: "How long does the exchange take?",
        a: "The exchange process usually takes 3–5 working days after approval. You'll be notified at every step.",
      },
      {
        q: "Is an unboxing video required?",
        a: "Yes, an opening/unboxing video is mandatory for any damage-related claims. Please record it at the time of delivery to be eligible.",
      },
    ],
  },
];

function AccordionItem({
  q,
  a,
  isOpen,
  onToggle,
}: {
  q: string;
  a: string;
  isOpen: boolean;
  onToggle: () => void;
}) {
  return (
    <div
      className={`border-b border-[#9A7A46]/20 transition-colors duration-200 ${
        isOpen ? "bg-[#9A7A46]/5" : "hover:bg-[#9A7A46]/[0.03]"
      }`}
    >
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left group"
      >
        <span
          className={`text-sm font-medium tracking-wide transition-colors duration-200 ${
            isOpen
              ? "text-[#9A7A46]"
              : "text-zinc-800 group-hover:text-[#9A7A46]"
          }`}
        >
          {q}
        </span>
        <span
          className={`flex-shrink-0 w-5 h-5 rounded-full border flex items-center justify-center transition-all duration-200 ${
            isOpen
              ? "border-[#9A7A46] bg-[#9A7A46] text-white"
              : "border-zinc-300 text-zinc-400 group-hover:border-[#9A7A46] group-hover:text-[#9A7A46]"
          }`}
        >
          {isOpen ? (
            <Minus size={10} strokeWidth={2.5} />
          ) : (
            <Plus size={10} strokeWidth={2.5} />
          )}
        </span>
      </button>

      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? "max-h-40 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <p className="px-5 pb-4 text-sm text-zinc-500 leading-relaxed pr-12">
          {a}
        </p>
      </div>
    </div>
  );
}

export default function FAQSection() {
  const [openItem, setOpenItem] = useState<string | null>(null);

  const toggle = (key: string) => {
    setOpenItem((prev) => (prev === key ? null : key));
  };

  return (
    <div className="min-h-screen bg-[#FAFAF8] flex items-center justify-center py-4 md:py-8">
      <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="h-px w-8 bg-[#9A7A46]/40" />
            <ShoppingBag size={14} className="text-[#9A7A46]" />
            <div className="h-px w-8 bg-[#9A7A46]/40" />
          </div>
          <h2
            className="text-3xl font-light tracking-[0.12em] text-zinc-800 uppercase mb-3"
            style={{ fontFamily: "'Playfair Display', Georgia, serif" }}
          >
            Common Questions
          </h2>
          <p className="text-sm text-zinc-400 tracking-widest uppercase">
            Everything you need to know
          </p>
        </div>

        {/* FAQ Categories */}
        <div className="space-y-6">
          {faqs.map((group) => (
            <div key={group.category}>
              {/* Category Label */}
              <div className="flex items-center gap-3 mb-2 px-1">
                <span className="text-[10px] font-semibold tracking-[0.2em] uppercase text-[#9A7A46]">
                  {group.category}
                </span>
                <div className="flex-1 h-px bg-[#9A7A46]/15" />
              </div>

              {/* Items */}
              <div className="border rounded-lg overflow-hidden bg-white">
                {group.items.map((item, idx) => (
                  <AccordionItem
                    key={idx}
                    q={item.q}
                    a={item.a}
                    isOpen={openItem === `${group.category}-${idx}`}
                    onToggle={() => toggle(`${group.category}-${idx}`)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
