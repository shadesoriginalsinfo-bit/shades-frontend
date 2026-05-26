import type { IOrder, IAdminOrder } from "@/types/order";

const fmt = (n: number) => `&#8377;${n.toLocaleString("en-IN")}`;
const fmtDate = (s: string) =>
  new Date(s).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

function statusColor(status: string): string {
  const map: Record<string, string> = {
    PENDING: "#b45309",
    CONFIRMED: "#1d4ed8",
    SHIPPED: "#7c3aed",
    DELIVERED: "#065f46",
    CANCELLED: "#be123c",
    REFUNDED: "#065f46",
  };
  return map[status] ?? "#374151";
}

export function downloadInvoice(
  order: IOrder | IAdminOrder,
  logoUrl?: string,
): void {
  const adminOrder = order as IAdminOrder;
  const hasUser = !!adminOrder?.user;

  const itemRows = order.items
    .map((item) => {
      const color = item.variantSize?.variant?.color ?? "";
      const size = item.variantSize?.size ?? "";
      const meta = [color, size ? `Size: ${size}` : ""]
        .filter(Boolean)
        .join(" · ");
      return `
        <tr>
          <td style="padding:10px 12px;border-bottom:1px solid #f0e8de;vertical-align:top;">
            <div style="font-size:13px;color:#1a1a1a;font-weight:500;">${item.product.title}</div>
            ${meta ? `<div style="font-size:11px;color:#888;margin-top:2px;">${meta}</div>` : ""}
          </td>
          <td style="padding:10px 12px;border-bottom:1px solid #f0e8de;text-align:center;font-size:13px;color:#374151;">${item.quantity}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #f0e8de;text-align:right;font-size:13px;color:#374151;">${fmt(item.unitPrice)}</td>
          <td style="padding:10px 12px;border-bottom:1px solid #f0e8de;text-align:right;font-size:13px;font-weight:600;color:#1a1a1a;">${fmt(item.totalPrice)}</td>
        </tr>`;
    })
    .join("");

  const addr = order.shippingAddress;
  const addrLines = [
    addr?.label ? `<strong>${addr.label}</strong>` : "",
    addr?.line1,
    addr?.line2,
    [addr?.city, addr?.state].filter(Boolean).join(", "),
    [addr?.postalCode, addr?.country].filter(Boolean).join(", "),
  ]
    .filter(Boolean)
    .join("<br/>");

  const paymentRefs = order.payments
    ?.filter((p) => p.providerOrderId || p.providerPaymentId)
    .map(
      (p) => `
      <div style="margin-bottom:4px;">
        ${p.providerOrderId ? `<div style="font-size:11px;color:#555;font-family:monospace;">Order Ref: ${p.providerOrderId}</div>` : ""}
        ${p.providerPaymentId ? `<div style="font-size:11px;color:#555;font-family:monospace;">Payment Ref: ${p.providerPaymentId}</div>` : ""}
      </div>`,
    )
    .join("");

  const logoHtml = logoUrl
    ? `<img src="${logoUrl}" alt="Shades" style="height:48px;object-fit:contain;" />`
    : `<span style="font-family:Georgia,serif;font-size:22px;font-weight:700;color:#1a1a1a;letter-spacing:0.05em;">SHADES</span>`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <title>Invoice &mdash; ${order.id}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0;}
    body{font-family:'Helvetica Neue',Arial,sans-serif;background:#fff;color:#1a1a1a;-webkit-print-color-adjust:exact;print-color-adjust:exact;}
    @page{size:A4;margin:20mm 18mm;}
    @media print{
      body{padding:0;}
    }
    .page{max-width:760px;margin:0 auto;padding:40px 40px 60px;}
  </style>
</head>
<body>
<div class="page">

  <!-- Header -->
  <table style="width:100%;margin-bottom:36px;">
    <tr>
      <td style="vertical-align:top;">${logoHtml}</td>
      <td style="vertical-align:top;text-align:right;">
        <div style="font-size:28px;font-weight:300;letter-spacing:0.15em;color:#9A7A46;margin-bottom:6px;">INVOICE</div>
        <div style="font-size:11px;color:#888;letter-spacing:0.08em;font-family:monospace;">${order.id}</div>
        <div style="font-size:11px;color:#888;margin-top:4px;">
          ${fmtDate(order.placedAt ?? order.createdAt)}
        </div>
        <div style="margin-top:8px;display:inline-block;padding:3px 10px;border-radius:2px;font-size:10px;letter-spacing:0.12em;font-weight:700;text-transform:uppercase;color:${statusColor(order.status)};border:1px solid ${statusColor(order.status)}20;background:${statusColor(order.status)}10;">
          ${order.status}
        </div>
      </td>
    </tr>
  </table>

  <!-- Bill To / Ship To -->
  <table style="width:100%;margin-bottom:32px;border-top:2px solid #9A7A46;padding-top:20px;">
    <tr>
      ${
        hasUser
          ? `<td style="width:50%;vertical-align:top;padding-top:16px;">
              <div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#9A7A46;font-weight:700;margin-bottom:8px;">Bill To</div>
              <div style="font-size:13px;font-weight:600;color:#1a1a1a;margin-bottom:2px;">${adminOrder.user.name}</div>
              <div style="font-size:12px;color:#555;">${adminOrder.user.email}</div>
              <div style="font-size:12px;color:#555;">${adminOrder.user.mobileNumber}</div>
            </td>`
          : "<td></td>"
      }
      <td style="width:50%;vertical-align:top;padding-top:16px;${hasUser ? "padding-left:24px;border-left:1px solid #f0e8de;" : ""}">
        <div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#9A7A46;font-weight:700;margin-bottom:8px;">Ship To</div>
        <div style="font-size:12px;color:#555;line-height:1.7;">${addrLines}</div>
      </td>
    </tr>
  </table>

  <!-- Payment & Tracking info -->
  <table style="width:100%;margin-bottom:28px;">
    <tr>
      <td style="width:33%;vertical-align:top;">
        <div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#9A7A46;font-weight:700;margin-bottom:6px;">Payment Method</div>
        <div style="font-size:12px;color:#374151;">${order.paymentMethod === "COD" ? "Cash on Delivery" : "Online Payment"}</div>
      </td>
      <td style="width:33%;vertical-align:top;padding-left:16px;">
        <div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#9A7A46;font-weight:700;margin-bottom:6px;">Payment Status</div>
        <div style="font-size:12px;color:#374151;">${order.paymentStatus}</div>
      </td>
      ${
        order.trackingNumber
          ? `<td style="width:34%;vertical-align:top;padding-left:16px;">
              <div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#9A7A46;font-weight:700;margin-bottom:6px;">Tracking Number</div>
              <div style="font-size:12px;color:#374151;font-family:monospace;">${order.trackingNumber}</div>
            </td>`
          : "<td></td>"
      }
    </tr>
  </table>

  <!-- Items table -->
  <table style="width:100%;border-collapse:collapse;margin-bottom:24px;">
    <thead>
      <tr style="background:#f8f4ee;">
        <th style="padding:10px 12px;text-align:left;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#9A7A46;font-weight:700;border-bottom:2px solid #e8ddd0;">Item</th>
        <th style="padding:10px 12px;text-align:center;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#9A7A46;font-weight:700;border-bottom:2px solid #e8ddd0;">Qty</th>
        <th style="padding:10px 12px;text-align:right;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#9A7A46;font-weight:700;border-bottom:2px solid #e8ddd0;">Unit Price</th>
        <th style="padding:10px 12px;text-align:right;font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#9A7A46;font-weight:700;border-bottom:2px solid #e8ddd0;">Total</th>
      </tr>
    </thead>
    <tbody>${itemRows}</tbody>
  </table>

  <!-- Price summary -->
  <table style="width:100%;margin-bottom:32px;">
    <tr>
      <td style="width:55%"></td>
      <td style="width:45%;">
        <table style="width:100%;border-collapse:collapse;">
          <tr>
            <td style="padding:6px 0;font-size:12px;color:#555;">Subtotal</td>
            <td style="padding:6px 0;font-size:12px;color:#555;text-align:right;">${fmt(order.subtotal)}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-size:12px;color:#555;">Tax (GST)</td>
            <td style="padding:6px 0;font-size:12px;color:#555;text-align:right;">${fmt(order.taxAmount)}</td>
          </tr>
          <tr>
            <td style="padding:6px 0;font-size:12px;color:#555;">Shipping</td>
            <td style="padding:6px 0;font-size:12px;color:#555;text-align:right;">${order.shippingAmount === 0 ? "Free" : fmt(order.shippingAmount)}</td>
          </tr>
          ${
            order.discountAmount > 0
              ? `<tr>
                  <td style="padding:6px 0;font-size:12px;color:#16a34a;">Discount</td>
                  <td style="padding:6px 0;font-size:12px;color:#16a34a;text-align:right;">&#8722;${fmt(order.discountAmount)}</td>
                </tr>`
              : ""
          }
          <tr style="border-top:2px solid #9A7A46;">
            <td style="padding:10px 0 6px;font-size:14px;font-weight:700;color:#1a1a1a;">Total</td>
            <td style="padding:10px 0 6px;font-size:14px;font-weight:700;color:#1a1a1a;text-align:right;">${fmt(order.totalAmount)}</td>
          </tr>
        </table>
      </td>
    </tr>
  </table>

  <!-- Payment references -->
  ${
    paymentRefs
      ? `<div style="border-top:1px solid #f0e8de;padding-top:16px;margin-bottom:24px;">
          <div style="font-size:10px;letter-spacing:0.18em;text-transform:uppercase;color:#9A7A46;font-weight:700;margin-bottom:8px;">Payment Reference</div>
          ${paymentRefs}
        </div>`
      : ""
  }

  <!-- Footer -->
  <div style="border-top:1px solid #e8ddd0;padding-top:20px;text-align:center;">
    <div style="font-size:11px;color:#aaa;letter-spacing:0.08em;">Thank you for shopping with Shades &mdash; shades.in</div>
  </div>

</div>
</body>
</html>`;

  const win = window.open("", "_blank");
  if (!win) {
    alert("Please allow pop-ups to download the invoice.");
    return;
  }
  win.document.write(html);
  win.document.close();
  // Trigger print dialog once the new window has finished rendering
  win.addEventListener("load", () => win.print());
}
