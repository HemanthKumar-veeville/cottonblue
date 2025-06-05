import { jsPDF } from "jspdf";

interface OrderItem {
  product_id: number;
  product_name: string;
  product_image: string;
  product_price: number;
  quantity: number;
}

interface Order {
  createdAt: string;
  orderId: number;
  orderItems: OrderItem[];
  orderStatus: string;
  storeAddress: string;
  storeName: string;
}

// Helper function to convert URL to base64
const getBase64FromUrl = async (url: string): Promise<string> => {
  const response = await fetch(url, {
    mode: 'no-cors',
    cache: 'no-cache',
    headers: {
      'Access-Control-Allow-Origin': '*'
    }
  });
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        resolve(result);
      };
      reader.onerror = reject;
      reader.readAsDataURL(blob);
    } catch (error) {
      reject(error);
    }
  });
};

// Helper function to convert hex color to RGB
const hexToRgb = (hex: string): { r: number; g: number; b: number } => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : { r: 0, g: 0, b: 0 };
};

export const handleDownloadInvoice = async (
  order: Order,
  company_bg_color: string,
  company_text_color: string,
  company_logo: string,
  company_name: string,
) => {
  // Initialize PDF document
  const doc = new jsPDF();
  
  // Set initial y position and margins
  let yPos = 15;
  const leftMargin = 20;
  const pageWidth = doc.internal.pageSize.width;
  
  // Convert hex colors to RGB for jsPDF
  const bgColor = hexToRgb(company_bg_color);
  const textColor = hexToRgb(company_text_color);
  
  // Add company header background
  doc.setFillColor(bgColor.r, bgColor.g, bgColor.b);
  doc.rect(0, 0, pageWidth, 40, 'F');
  
  // Add company logo with error handling
  try {
    let logoData = company_logo;
    
    // If it's a URL and not already a base64 string, convert it
    if (!company_logo.startsWith('data:image/')) {
      logoData = await getBase64FromUrl(company_logo);
    }
    
    // Add the image with proper dimensions
    const logoWidth = 50;
    const logoHeight = 30;
    
    // Determine image format
    const format = logoData.includes('data:image/png') ? 'PNG' : 'JPEG';
    
    // Add the image to the PDF
    doc.addImage(
      logoData,
      format,
      leftMargin,
      5,
      logoWidth,
      logoHeight,
      undefined,
      'FAST'
    );
  } catch (error) {
    console.error('Error adding logo:', error);
    // If logo fails, add a placeholder text
    doc.setTextColor(textColor.r, textColor.g, textColor.b);
    doc.setFontSize(12);
    doc.text('Logo', leftMargin, 20);
  }
  
  // Add company name with custom color and enhanced styling
  doc.setTextColor(textColor.r, textColor.g, textColor.b);
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  const companyNameWidth = doc.getTextWidth(company_name);
  doc.text(company_name, (pageWidth - companyNameWidth) / 2, 25); // Centered
  
  // Reset font
  doc.setFont('helvetica', 'normal');
  
  // Add a subtle divider line
  yPos = 45;
  doc.setDrawColor(bgColor.r, bgColor.g, bgColor.b);
  doc.line(leftMargin, yPos, pageWidth - leftMargin, yPos);
  
  // Reset text color for main content
  doc.setTextColor(0, 0, 0);
  
  // Add Order Details
  yPos += 15;
  doc.setFontSize(16);
  doc.setTextColor(bgColor.r, bgColor.g, bgColor.b);
  doc.text('ORDER DETAILS', leftMargin, yPos);
  
  // Add colored rectangle behind order info
  doc.setFillColor(bgColor.r, bgColor.g, bgColor.b);
  doc.rect(leftMargin, yPos + 5, pageWidth - 40, 30, 'F');
  
  // Order basic info
  doc.setFontSize(12);
  doc.setTextColor(textColor.r, textColor.g, textColor.b);
  yPos += 20;
  doc.text(`Order ID: #${order.orderId}`, leftMargin + 5, yPos);
  doc.text(`Date: ${new Date(order.createdAt).toLocaleDateString()}`, pageWidth - 100, yPos);
  doc.text(`Status: ${order.orderStatus}`, leftMargin + 5, yPos + 10);
  
  // Reset text color for main content
  doc.setTextColor(0, 0, 0);
  
  // Store Information
  yPos += 30;
  doc.setFontSize(14);
  doc.setTextColor(bgColor.r, bgColor.g, bgColor.b);
  doc.text('Store Information:', leftMargin, yPos);
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(12);
  yPos += 10;
  doc.text(`Store Name: ${order.storeName}`, leftMargin, yPos);
  yPos += 10;
  doc.text(`Address: ${order.storeAddress}`, leftMargin, yPos);
  
  // Items Table Header
  yPos += 20;
  const tableHeaders = ['Product', 'Price', 'Quantity', 'Total'];
  const columnWidths = [80, 30, 30, 30];
  
  // Add table header with background
  doc.setFillColor(bgColor.r, bgColor.g, bgColor.b);
  doc.rect(leftMargin, yPos, pageWidth - 40, 10, 'F');
  
  // Add header text
  doc.setTextColor(textColor.r, textColor.g, textColor.b);
  let xPos = leftMargin + 5;
  tableHeaders.forEach((header, index) => {
    doc.text(header, xPos, yPos + 7);
    xPos += columnWidths[index];
  });
  
  // Reset text color for table content
  doc.setTextColor(0, 0, 0);
  
  // Add table content
  yPos += 15;
  let totalAmount = 0;
  
  order.orderItems.forEach((item) => {
    const itemTotal = item.product_price * item.quantity;
    totalAmount += itemTotal;
    
    xPos = leftMargin + 5;
    doc.text(item.product_name, xPos, yPos);
    doc.text(`$${item.product_price}`, xPos + columnWidths[0], yPos);
    doc.text(item.quantity.toString(), xPos + columnWidths[0] + columnWidths[1], yPos);
    doc.text(`$${itemTotal}`, xPos + columnWidths[0] + columnWidths[1] + columnWidths[2], yPos);
    
    yPos += 10;
  });
  
  // Add total
  yPos += 10;
  doc.setFillColor(bgColor.r, bgColor.g, bgColor.b);
  doc.rect(pageWidth - 90, yPos - 5, 70, 10, 'F');
  doc.setTextColor(textColor.r, textColor.g, textColor.b);
  doc.text(`Total Amount: $${totalAmount}`, pageWidth - 85, yPos);
  
  // Add footer
  const footerText = 'Thank you for your business!';
  doc.setFontSize(10);
  doc.setTextColor(bgColor.r, bgColor.g, bgColor.b);
  doc.text(
    footerText,
    pageWidth / 2 - doc.getTextWidth(footerText) / 2,
    doc.internal.pageSize.height - 20
  );
  
  // Save the PDF
  doc.save(`Order_${order.orderId}_${new Date().toISOString().split('T')[0]}.pdf`);
};