import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import type { PricedOrderItem } from './types';

interface BusinessSettings {
  companyName: string;
  companyAddress: string;
  companyPhone: string;
  companyEmail: string;
  companyWebsite: string;
  logo: string | null;
  invoiceNote: string;
}

export const generateInvoice = async (
  customerName: string,
  customerAddress: string,
  items: PricedOrderItem[],
  subtotal: number,
  shippingCost: number,
  taxRate: number,
  taxAmount: number,
  grandTotal: number,
  businessSettings: BusinessSettings,
  invoiceNumber: number,
  invoiceDate: string
) => {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  // Header Section
  let currentY = 20;
  // Add Logo (left side) - much smaller size
  if (businessSettings.logo) {
    try {
      doc.addImage(businessSettings.logo, 'PNG', 20, currentY, 25, 25);
    } catch (error) {
      console.warn('Could not add logo to PDF:', error);
    }
  }

  // Company Information (right side) - more compact without redundant company name
  doc.setTextColor(107, 114, 128); // Gray
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  
  let rightY = currentY + 5;
  if (businessSettings.companyAddress) {
    const addressLines = businessSettings.companyAddress.split('\n');
    addressLines.forEach(line => {
      doc.text(line.trim(), pageWidth - 20, rightY, { align: 'right' });
      rightY += 4;
    });
  }
  
  if (businessSettings.companyPhone) {
    doc.text(businessSettings.companyPhone, pageWidth - 20, rightY, { align: 'right' });
    rightY += 4;
  }
  
  if (businessSettings.companyEmail) {
    doc.text(businessSettings.companyEmail, pageWidth - 20, rightY, { align: 'right' });
    rightY += 4;
  }
  
  if (businessSettings.companyWebsite) {
    doc.text(businessSettings.companyWebsite, pageWidth - 20, rightY, { align: 'right' });
    rightY += 4;
  }
  currentY = Math.max(currentY + 30, rightY + 10);

  // Invoice Title - much smaller
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('INVOICE', 20, currentY);

  currentY += 15;

  // Bill To Section (left) and Invoice Details (right)
  // Bill To
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.text('Bill To:', 20, currentY);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  let billToY = currentY + 8;
  doc.text(customerName || 'Customer Name', 20, billToY);
  billToY += 6;
  
  if (customerAddress) {
    const customerAddressLines = customerAddress.split('\n');
    customerAddressLines.forEach(line => {
      doc.text(line.trim(), 20, billToY);
      billToY += 5;
    });
  }

  // Invoice Details (right side)
  const detailsX = pageWidth - 80;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(12);
  doc.text('Invoice Details:', detailsX, currentY);
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(11);
  let detailsY = currentY + 8;
  
  doc.text(`Invoice no.: ${invoiceNumber}`, detailsX, detailsY);
  detailsY += 6;
  
  const formattedDate = new Date(invoiceDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  });
  doc.text(`Invoice date: ${formattedDate}`, detailsX, detailsY);

  currentY = Math.max(billToY, detailsY) + 20;

  // Items Table
  const tableColumns = ['#', 'Product or service', 'Description', 'Qty', 'Rate', 'Amount'];
  const tableRows: any[][] = [];

  items.forEach((item, index) => {
    const description = `${item.productName} - ${item.size}`;
    const amount = (item.quantity * item.price).toFixed(2);
    
    tableRows.push([
      (index + 1).toString(),
      'Apparel',
      description,
      item.quantity.toString(),
      `$${item.price.toFixed(2)}`,
      `$${amount}`
    ]);
  });

  autoTable(doc, {
    startY: currentY,
    head: [tableColumns],
    body: tableRows,
    theme: 'grid',
    headStyles: {
      fillColor: [243, 244, 246] as [number, number, number],
      textColor: [0, 0, 0],
      fontStyle: 'bold',
      fontSize: 10,
      halign: 'center'
    },
    bodyStyles: {
      fontSize: 9,
      cellPadding: 5
    },
    columnStyles: {
      0: { cellWidth: 15, halign: 'center' }, // #
      1: { cellWidth: 25, halign: 'left' },   // Product or service
      2: { cellWidth: 60, halign: 'left' },   // Description
      3: { cellWidth: 20, halign: 'center' }, // Qty
      4: { cellWidth: 25, halign: 'right' },  // Rate
      5: { cellWidth: 25, halign: 'right' }   // Amount
    },
    margin: { left: 20, right: 20 }
  });  // Get the final Y position after the table
  const finalY = (doc as any).lastAutoTable.finalY || currentY + 100;
  
  // Totals Section - Better positioning to avoid cutoff
  let totalSectionY = finalY + 15;
  
  // Check if we need a new page for totals
  const totalsSectionHeight = 100; // Approximate height needed for totals
  const availableSpace = pageHeight - totalSectionY - 60; // 60 for bottom margin and note
  
  if (availableSpace < totalsSectionHeight) {
    doc.addPage();
    totalSectionY = 40; // Start near top of new page
  }
  
  const rightAlignX = pageWidth - 20; // Right margin
  let totalRowY = totalSectionY;
  
  // Set consistent text properties
  doc.setTextColor(60, 60, 60);
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  
  // Subtotal
  doc.text('Subtotal:', rightAlignX - 60, totalRowY);
  doc.text(`$${subtotal.toFixed(2)}`, rightAlignX, totalRowY, { align: 'right' });
  totalRowY += 14;
  
  // Shipping (only if > 0)
  if (shippingCost > 0) {
    doc.text('Shipping:', rightAlignX - 60, totalRowY);
    doc.text(`$${shippingCost.toFixed(2)}`, rightAlignX, totalRowY, { align: 'right' });
    totalRowY += 14;
  }
  
  // Tax (only if > 0)
  if (taxRate > 0) {
    doc.text(`Tax (${taxRate}%):`, rightAlignX - 60, totalRowY);
    doc.text(`$${taxAmount.toFixed(2)}`, rightAlignX, totalRowY, { align: 'right' });
    totalRowY += 14;
  }
  
  // Add separator line
  totalRowY += 3;
  doc.setDrawColor(150, 150, 150);
  doc.setLineWidth(1);
  doc.line(rightAlignX - 80, totalRowY, rightAlignX, totalRowY);
  totalRowY += 8;
  
  // Grand Total - Make sure it fits on page
  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text('Total:', rightAlignX - 60, totalRowY);
  doc.text(`$${grandTotal.toFixed(2)}`, rightAlignX, totalRowY, { align: 'right' });
  
  // Move to next line for note spacing
  totalRowY += 20;
  // Note at bottom - position based on current page
  if (businessSettings.invoiceNote) {
    // Calculate note position - either at bottom of page or after totals with some spacing
    const noteY = Math.max(totalRowY + 30, pageHeight - 40);
    
    // If note would go beyond page, add a new page
    if (noteY > pageHeight - 30) {
      doc.addPage();
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text(businessSettings.invoiceNote, 20, 40);
    } else {
      doc.setTextColor(107, 114, 128);
      doc.setFontSize(10);
      doc.setFont('helvetica', 'italic');
      doc.text(businessSettings.invoiceNote, 20, noteY);
    }  }

  // Save the PDF with customer name at the end of filename
  const cleanCustomerName = customerName.replace(/[^a-zA-Z0-9]/g, '') || 'Customer';
  const cleanDate = formattedDate.replace(/\//g, '-');  const fileName = `Invoice-${invoiceNumber}-${cleanDate}-${cleanCustomerName}.pdf`;
    // Use the most compatible approach - let jsPDF handle the download
  try {
    // Use jsPDF's built-in save method which handles browser compatibility
    doc.save(fileName);
    
    // Return success
    return Promise.resolve();
  } catch (error) {
    console.error('Error saving PDF:', error);
    
    // Fallback: try blob-based approach
    try {
      const pdfBlob = doc.output('blob');
      const url = URL.createObjectURL(pdfBlob);
      
      // Create and trigger download link
      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      link.style.display = 'none';
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      // Clean up
      setTimeout(() => URL.revokeObjectURL(url), 100);
      
      return Promise.resolve();
    } catch (fallbackError) {
      console.error('Fallback download also failed:', fallbackError);
      return Promise.reject(fallbackError);
    }
  }
};
