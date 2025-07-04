import { jsPDF } from "jspdf";

// Updated interfaces to match provided data
interface OrderItem {
  product_id: number;
  product_name: string;
  product_images: string[] | null;
  product_size: string;
  product_suitable_for: string;
  product_price: number;
  quantity: number;
}

interface OrderedUser {
  user_id: number;
  firstname: string;
  lastname: string;
  email: string;
}

interface Order {
  order_id: number;
  vat_number: string;
  created_at: string;
  order_status: string;
  store_name: string;
  store_address: string;
  order_items: OrderItem[];
  ordered_user: OrderedUser;
}

// Helper: Convert image URL to base64
const getBase64FromUrl = async (url: string): Promise<string> => {
  const response = await fetch(url);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

// Helper: Convert HEX to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
};

// Import the static logo
import cottonblueLogo from '../../static/img/cotton_cropped_logo.png';

export const handleDownloadInvoice = async (
  order: any,
  company_bg_color: string,
  company_text_color: string,
  company_name: string,
  company_address: string,
  company_vat_number: string,
  company_contact_email: string,
  company_phone: string
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const leftMargin = 20;
  let yPos = 10;

  const bgColor = hexToRgb(company_bg_color);
  const textColor = hexToRgb(company_text_color);
  const lightBg = { r: 240, g: 250, b: 252 }; // light blue for boxes
  const darkBg = bgColor; // for total row

  const currencyFormat = new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
  });

  // --- HEADER ---
  // Static logo (left)
  // Original logo size: 1324x264 px, fit within 100px height
  const logoOriginalWidthPx = 1324;
  const logoOriginalHeightPx = 264;
  const maxLogoHeightPx = 15;
  const scale = maxLogoHeightPx / logoOriginalHeightPx;
  const logoWidthPx = logoOriginalWidthPx * scale;
  const logoHeightPx = logoOriginalHeightPx * scale;
  const pxToPt = 0.75; // jsPDF default: 1 px = 0.75 pt
  const logoWidth = logoWidthPx * pxToPt;
  const logoHeight = logoHeightPx * pxToPt;

  // Company info (right)
  doc.setFontSize(11);
  doc.setTextColor(80, 80, 80);
  const companyInfo = [
    company_name ?? "NA",
    company_address.split(',')[0] ?? "NA",
    company_address.split(',')[1] ?? "NA",
    company_vat_number ? `N° VAT: ${company_vat_number}` : "",
    company_phone ?? "",
    company_contact_email ?? "",
  ].filter((line) => !!line);
  let infoY = yPos + 2;
  const companyInfoLineHeight = 6;
  const companyInfoBlockHeight = companyInfo.length * companyInfoLineHeight;

  // Draw logo (left)
  try {
    doc.addImage(cottonblueLogo, "PNG", leftMargin, yPos, logoWidth, logoHeight);
  } catch {}

  // Draw company info (right)
  companyInfo.forEach((line, i) => {
    doc.text(String(line ?? 'NA'), pageWidth - leftMargin - 2, Number(infoY + i * companyInfoLineHeight), { align: "right" });
  });

  // Calculate header height as the max of logo and company info block
  const headerHeight = Math.max(logoHeight, companyInfoBlockHeight);
  yPos += headerHeight + 6; // Add a little extra spacing after header

  // --- BILLING SECTION ---
  // Facturer à (left)
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text("Facturer à", leftMargin, yPos);
  doc.setFont(undefined, "bold");
  doc.text(String(order?.store_name ?? 'NA'), leftMargin, Number(yPos + 7));
  doc.setFont(undefined, "normal");
  doc.setFontSize(10);
  doc.text(String(order?.store_address ?? 'NA'), leftMargin, Number(yPos + 13));
  if (order?.ordered_user?.email !== undefined) {
    doc.text(String(order?.ordered_user?.email ?? 'NA'), leftMargin, Number(yPos + 19));
  }
  yPos += 25;

  // --- DATE & REFERENCE BOX (right, light background, rounded) ---
  const boxX = leftMargin;
  const boxY = yPos;
  const boxW = 90;
  const boxH = 18;
  doc.setFillColor(lightBg.r, lightBg.g, lightBg.b);
  doc.roundedRect(boxX, boxY, boxW, boxH, 4, 4, 'F');
  doc.setTextColor(120, 140, 150);
  doc.setFontSize(10);
  doc.text(String('Date'), boxX + 6, Number(boxY + 7));
  doc.text(String('Référence'), boxX + boxW / 2 + 6, Number(boxY + 7));
  doc.setFont(undefined, "bold");
  doc.setTextColor(0, 0, 0);
  const date = order?.created_at ? new Date(order.created_at).toLocaleDateString("fr-FR") : "NA";
  doc.text(String(date ?? 'NA'), boxX + 6, Number(boxY + 14));
  doc.text(String(`#${order?.order_id ?? 'NA'}`), boxX + boxW / 2 + 6, Number(boxY + 14));
  doc.setFont(undefined, "normal");
  yPos += boxH + 8;

  // --- PRODUCT TABLE ---
  // Table header (light background, rounded top)
  const tableX = leftMargin;
  const tableY = yPos;
  const tableW = pageWidth - 2 * leftMargin;
  const rowH = 10;
  const colWidths = [tableW * 0.40, tableW * 0.15, tableW * 0.15, tableW * 0.20]; // Product, Qty, Price, Total
  doc.setFillColor(lightBg.r, lightBg.g, lightBg.b);
  doc.roundedRect(tableX, tableY, tableW, rowH, 4, 4, 'F');
  doc.setTextColor(120, 140, 150);
  doc.setFontSize(10);
  let colX = tableX + 4;
  ["Produit", "Qté", "Prix", "Total"].forEach((header, i) => {
    if (header === "Prix" || header === "Total") {
      // Right align header at the end of the column
      doc.text(String(header ?? 'NA'), colX + colWidths[i] - 4, Number(tableY + 7), { align: 'right' });
    } else {
      // Left align for other headers
      doc.text(String(header ?? 'NA'), colX, Number(tableY + 7));
    }
    colX += colWidths[i];
  });
  yPos += rowH;

  // Table rows
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(11);
  (order?.order_items ?? []).forEach((item: any, idx: number) => {
    let x = tableX + 4;
    let y = yPos + rowH * idx;
    doc.text(String(item?.product_name ?? 'NA'), x, Number(y + 7));
    x += colWidths[0];
    doc.text(String(item?.quantity ?? 'NA'), x, Number(y + 7));
    x += colWidths[1];
    // Right align 'Prix' in its column
    doc.text(String(currencyFormat.format(item?.product_price ?? 0)), x + colWidths[2] - 4, Number(y + 7), { align: 'right' });
    x += colWidths[2];
    const itemTotal = (item?.product_price ?? 0) * (item?.quantity ?? 0);
    // Right align 'Total' in its column
    doc.text(String(currencyFormat.format(itemTotal)), x + colWidths[3] - 4, Number(y + 7), { align: 'right' });
  });
  yPos += rowH * (order?.order_items?.length ?? 1);

  // Add vertical spacing before summary rows to prevent overlap
  yPos += 6;

  // Calculate totals before using them in summary rows
  const totalAmount = (order?.order_items ?? []).reduce((sum: number, item: any) => sum + (item?.product_price ?? 0) * (item?.quantity ?? 0), 0);
  const tax = totalAmount * 0.1;
  const grandTotal = totalAmount + tax;

  // --- SUMMARY ROWS ---
  // Tax row (light background)
  doc.setFillColor(lightBg.r, lightBg.g, lightBg.b);
  doc.rect(tableX, yPos, tableW, rowH, 'F');
  doc.setTextColor(120, 140, 150);
  // Calculate the start and end of the last column
  const lastColStartX = tableX + tableW - colWidths[3];
  const lastColEndX = tableX + tableW;
  const firstColStartX = tableX + 4;
  const firstColEndX = tableX + colWidths[0];

  const labelPadding = 4;
  const valuePadding = 8;
  // Label: left-aligned within the last column, with padding
  doc.text('Taxe (10%)', firstColStartX + labelPadding, yPos + 7, { align: 'left' });
  // Value: right-aligned at the end of the last column, with padding
  const taxValue = String(currencyFormat.format(tax));
  doc.setTextColor(0, 0, 0);
  doc.text(taxValue, lastColEndX - valuePadding, yPos + 7, { align: 'right' });
  yPos += rowH;

  // Total row (dark background, white text, rounded bottom)
  doc.setFillColor(darkBg.r, darkBg.g, darkBg.b);
  doc.roundedRect(tableX, yPos, tableW, rowH, 0, 0, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', "bold");
  // Label: left-aligned within the last column, with padding
  doc.text('Total', firstColStartX + labelPadding, yPos + 7, { align: 'left' });
  // Value: right-aligned at the end of the last column, with padding
  const grandTotalValue = String(currencyFormat.format(grandTotal));
  doc.text(grandTotalValue, lastColEndX - valuePadding, yPos + 7, { align: 'right' });
  doc.setFont('helvetica', "normal");

  // --- END ---
  doc.save(`Order_${order?.order_id ?? "NA"}_${order?.created_at ? order.created_at.split(" ")[0] : "NA"}.pdf`);
};
