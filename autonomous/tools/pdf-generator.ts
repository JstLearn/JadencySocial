/**
 * PDF Generator Tool
 *
 * PDF document creation for:
 * - Proposals
 * - Contracts
 * - Invoices
 * - Reports
 * - Business cards
 */

import { TDocumentDefinitions, Content } from 'pdfmake/interfaces';
import fs from 'fs';
import path from 'path';

// pdfmake types are incomplete, use require
// eslint-disable-next-line @typescript-eslint/no-require-imports
const PdfPrinter = require('pdfmake').default;

// Simple font setup without vfs
const printer = new PdfPrinter({
  Roboto: {
    normal: 'Helvetica',
    bold: 'Helvetica-Bold',
    italics: 'Helvetica-Oblique',
    bolditalics: 'Helvetica-BoldOblique',
  },
});

export interface ProposalData {
  proposalNumber: string;
  clientName: string;
  clientBusiness: string;
  clientAddress: string;
  clientEmail: string;
  clientPhone: string;
  date: Date;
  validUntil: Date;
  services: {
    name: string;
    description: string;
    monthlyPrice: number;
  }[];
  totalMonthly: number;
  contractLength: number;
  totalContract: number;
  paymentTerms: string;
  executiveSummary: string;
  companyName: string;
  companyEmail: string;
  companyPhone: string;
  companyAddress: string;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: Date;
  dueDate: Date;
  clientName: string;
  clientAddress: string;
  clientEmail: string;
  items: {
    description: string;
    quantity: number;
    unitPrice: number;
    total: number;
  }[];
  subtotal: number;
  tax: number;
  total: number;
  notes?: string;
  companyName: string;
  companyAddress: string;
  companyEmail: string;
  companyPhone: string;
}

export interface ReportData {
  title: string;
  period: string;
  clientName: string;
  generatedDate: Date;
  sections: {
    title: string;
    content: Content;
  }[];
  companyName: string;
  companyLogo?: string;
}

// Color palette
const colors = {
  primary: '#2563eb',
  secondary: '#64748b',
  accent: '#f59e0b',
  background: '#f8fafc',
  text: '#1e293b',
  lightText: '#64748b',
  border: '#e2e8f0',
  white: '#ffffff',
  success: '#10b981',
};

/**
 * Generate proposal PDF
 */
export async function generateProposal(data: ProposalData): Promise<Buffer> {
  const docDefinition: TDocumentDefinitions = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    content: [
      // Header
      {
        columns: [
          {
            text: data.companyName,
            style: 'companyName',
          },
          {
            text: `Teklif #${data.proposalNumber}`,
            style: 'documentTitle',
            alignment: 'right',
          },
        ],
        marginBottom: 20,
      },
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: colors.primary }],
        marginBottom: 20,
      },

      // Client Info
      {
        columns: [
          {
            width: '50%',
            stack: [
              { text: 'Müşteri Bilgileri', style: 'sectionHeader' },
              { text: data.clientBusiness, style: 'clientName' },
              { text: data.clientName, style: 'normal' },
              { text: data.clientAddress, style: 'normal' },
              { text: data.clientEmail, style: 'normal' },
              { text: data.clientPhone, style: 'normal' },
            ],
          },
          {
            width: '50%',
            stack: [
              { text: 'Teklif Bilgileri', style: 'sectionHeader', alignment: 'right' },
              {
                columns: [
                  { text: 'Tarih:', style: 'label', width: 80 },
                  { text: formatDate(data.date), style: 'value', alignment: 'right' },
                ],
              },
              {
                columns: [
                  { text: 'Geçerlilik:', style: 'label', width: 80 },
                  { text: formatDate(data.validUntil), style: 'value', alignment: 'right' },
                ],
              },
              {
                columns: [
                  { text: 'Sözleşme:', style: 'label', width: 80 },
                  { text: `${data.contractLength} ay`, style: 'value', alignment: 'right' },
                ],
              },
            ],
          },
        ],
        marginBottom: 30,
      },

      // Executive Summary
      {
        text: 'Yönetici Özeti',
        style: 'sectionHeader',
        marginBottom: 10,
      },
      {
        text: data.executiveSummary,
        style: 'normal',
        marginBottom: 20,
      },

      // Services Table
      {
        text: 'Hizmet Detayları',
        style: 'sectionHeader',
        marginBottom: 10,
      },
      {
        table: {
          headerRows: 1,
          widths: ['*', 'auto', 'auto'],
          body: [
            [
              { text: 'Hizmet', style: 'tableHeader' },
              { text: 'Açıklama', style: 'tableHeader' },
              { text: 'Aylık Fiyat', style: 'tableHeader', alignment: 'right' },
            ],
            ...data.services.map((service) => [
              { text: service.name, style: 'tableCell' },
              { text: service.description, style: 'tableCell' },
              { text: formatCurrency(service.monthlyPrice), style: 'tableCell', alignment: 'right' },
            ]),
            [
              { text: '', colSpan: 2, border: [false, false, false, false] },
              '',
              '',
            ],
            [
              { text: 'Aylık Toplam:', style: 'tableHeader', colSpan: 2, alignment: 'right' },
              '',
              { text: formatCurrency(data.totalMonthly), style: 'tableHeader', alignment: 'right' },
            ],
            [
              { text: `Sözleşme Süresi (${data.contractLength} ay):`, style: 'totalLabel', colSpan: 2, alignment: 'right' },
              '',
              { text: formatCurrency(data.totalContract), style: 'totalValue', alignment: 'right' },
            ],
          ],
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 0,
          hLineColor: () => colors.border,
          paddingTop: () => 8,
          paddingBottom: () => 8,
        },
        marginBottom: 20,
      } as Content,

      // Payment Terms
      {
        text: 'Ödeme Koşulları',
        style: 'sectionHeader',
        marginBottom: 10,
      },
      {
        text: data.paymentTerms,
        style: 'normal',
        marginBottom: 20,
      },

      // Next Steps
      {
        text: 'Sonraki Adımlar',
        style: 'sectionHeader',
        marginBottom: 10,
      },
      {
        ol: [
          'Teklifi inceleyip onaylamanız',
          'Sözleşmeyi imzalamanız',
          'İlk ödeme yapmanız',
          'Hizmet başlangıcı için kick-off toplantısı',
        ],
        style: 'normal',
        marginBottom: 30,
      },

      // Company Info
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 1, lineColor: colors.border }],
        marginBottom: 10,
      },
      {
        columns: [
          {
            width: '50%',
            stack: [
              { text: data.companyName, style: 'footerTitle' },
              { text: data.companyAddress, style: 'footer' },
            ],
          },
          {
            width: '50%',
            stack: [
              { text: data.companyEmail, style: 'footer', alignment: 'right' },
              { text: data.companyPhone, style: 'footer', alignment: 'right' },
            ],
          },
        ],
      },
    ],
    styles: {
      companyName: {
        fontSize: 24,
        bold: true,
        color: colors.primary,
      },
      documentTitle: {
        fontSize: 14,
        color: colors.secondary,
      },
      sectionHeader: {
        fontSize: 12,
        bold: true,
        color: colors.primary,
        marginBottom: 5,
      },
      clientName: {
        fontSize: 14,
        bold: true,
        color: colors.text,
      },
      normal: {
        fontSize: 10,
        color: colors.text,
        lineHeight: 1.4,
      },
      label: {
        fontSize: 10,
        color: colors.lightText,
      },
      value: {
        fontSize: 10,
        color: colors.text,
      },
      tableHeader: {
        fontSize: 10,
        bold: true,
        color: colors.white,
        fillColor: colors.primary,
      },
      tableCell: {
        fontSize: 9,
        color: colors.text,
      },
      totalLabel: {
        fontSize: 11,
        bold: true,
        color: colors.text,
      },
      totalValue: {
        fontSize: 11,
        bold: true,
        color: colors.primary,
      },
      footerTitle: {
        fontSize: 10,
        bold: true,
        color: colors.text,
      },
      footer: {
        fontSize: 9,
        color: colors.lightText,
      },
    },
    defaultStyle: {
      font: 'Roboto',
    },
  };

  return new Promise<Buffer>((resolve, reject) => {
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks: Buffer[] = [];

    pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
    pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
    pdfDoc.on('error', reject);
    pdfDoc.end();
  });
}

/**
 * Generate invoice PDF
 */
export async function generateInvoice(data: InvoiceData): Promise<Buffer> {
  const docDefinition: TDocumentDefinitions = {
    pageSize: 'A4',
    pageMargins: [40, 60, 40, 60],
    content: [
      // Header
      {
        columns: [
          {
            stack: [
              { text: data.companyName, style: 'companyName' },
              { text: data.companyAddress, style: 'normal' },
              { text: data.companyEmail, style: 'normal' },
              { text: data.companyPhone, style: 'normal' },
            ],
          },
          {
            stack: [
              { text: 'FATURA', style: 'invoiceTitle', alignment: 'right' },
              {
                columns: [
                  { text: 'Fatura No:', style: 'label', width: 80 },
                  { text: data.invoiceNumber, style: 'value', alignment: 'right' },
                ],
              },
              {
                columns: [
                  { text: 'Tarih:', style: 'label', width: 80 },
                  { text: formatDate(data.invoiceDate), style: 'value', alignment: 'right' },
                ],
              },
              {
                columns: [
                  { text: 'Vade:', style: 'label', width: 80 },
                  { text: formatDate(data.dueDate), style: 'value', alignment: 'right' },
                ],
              },
            ],
          },
        ],
        marginBottom: 30,
      },
      {
        canvas: [{ type: 'line', x1: 0, y1: 0, x2: 515, y2: 0, lineWidth: 2, lineColor: colors.primary }],
        marginBottom: 20,
      },

      // Client Info
      {
        stack: [
          { text: 'Müşteri Bilgileri', style: 'sectionHeader' },
          { text: data.clientName, style: 'clientName' },
          { text: data.clientAddress, style: 'normal' },
          { text: data.clientEmail, style: 'normal' },
        ],
        marginBottom: 20,
      },

      // Items Table
      {
        table: {
          headerRows: 1,
          widths: ['*', 50, 80, 80],
          body: [
            [
              { text: 'Açıklama', style: 'tableHeader' },
              { text: 'Adet', style: 'tableHeader', alignment: 'center' },
              { text: 'Birim Fiyat', style: 'tableHeader', alignment: 'right' },
              { text: 'Toplam', style: 'tableHeader', alignment: 'right' },
            ],
            ...data.items.map((item) => [
              { text: item.description, style: 'tableCell' },
              { text: item.quantity.toString(), style: 'tableCell', alignment: 'center' },
              { text: formatCurrency(item.unitPrice), style: 'tableCell', alignment: 'right' },
              { text: formatCurrency(item.total), style: 'tableCell', alignment: 'right' },
            ]),
          ],
        },
        layout: {
          hLineWidth: () => 1,
          vLineWidth: () => 0,
          hLineColor: () => colors.border,
          paddingTop: () => 8,
          paddingBottom: () => 8,
        },
        marginBottom: 20,
      } as Content,

      // Totals
      {
        columns: [
          { width: '*', text: '' },
          {
            width: 180,
            stack: [
              {
                columns: [
                  { text: 'Ara Toplam:', style: 'totalLabel', width: 100 },
                  { text: formatCurrency(data.subtotal), style: 'value', alignment: 'right' },
                ],
              },
              {
                columns: [
                  { text: 'KDV (%20):', style: 'totalLabel', width: 100 },
                  { text: formatCurrency(data.tax), style: 'value', alignment: 'right' },
                ],
              },
              {
                canvas: [{ type: 'line', x1: 0, y1: 0, x2: 180, y2: 0, lineWidth: 1, lineColor: colors.border }],
                margin: [0, 5],
              },
              {
                columns: [
                  { text: 'TOPLAM:', style: 'grandTotalLabel', width: 100 },
                  { text: formatCurrency(data.total), style: 'grandTotalValue', alignment: 'right' },
                ],
              },
            ],
          },
        ],
        marginBottom: 30,
      },

      // Notes
      ...(data.notes
        ? [{
            stack: [
              { text: 'Notlar', style: 'sectionHeader' },
              { text: data.notes, style: 'normal' },
            ],
          } as Content]
        : []),
    ],
    styles: {
      companyName: {
        fontSize: 20,
        bold: true,
        color: colors.primary,
      },
      invoiceTitle: {
        fontSize: 24,
        bold: true,
        color: colors.primary,
        marginBottom: 10,
      },
      sectionHeader: {
        fontSize: 12,
        bold: true,
        color: colors.primary,
        marginBottom: 5,
      },
      clientName: {
        fontSize: 14,
        bold: true,
        color: colors.text,
      },
      normal: {
        fontSize: 10,
        color: colors.text,
        lineHeight: 1.4,
      },
      label: {
        fontSize: 10,
        color: colors.lightText,
      },
      value: {
        fontSize: 10,
        color: colors.text,
      },
      tableHeader: {
        fontSize: 10,
        bold: true,
        color: colors.white,
        fillColor: colors.primary,
      },
      tableCell: {
        fontSize: 9,
        color: colors.text,
      },
      totalLabel: {
        fontSize: 10,
        color: colors.text,
      },
      totalValue: {
        fontSize: 10,
        color: colors.text,
      },
      grandTotalLabel: {
        fontSize: 12,
        bold: true,
        color: colors.primary,
      },
      grandTotalValue: {
        fontSize: 12,
        bold: true,
        color: colors.primary,
      },
    },
    defaultStyle: {
      font: 'Roboto',
    },
  };

  return new Promise<Buffer>((resolve, reject) => {
    const pdfDoc = printer.createPdfKitDocument(docDefinition);
    const chunks: Buffer[] = [];

    pdfDoc.on('data', (chunk: Buffer) => chunks.push(chunk));
    pdfDoc.on('end', () => resolve(Buffer.concat(chunks)));
    pdfDoc.on('error', reject);
    pdfDoc.end();
  });
}

/**
 * Save PDF to file
 */
export async function savePdf(buffer: Buffer, filePath: string): Promise<string> {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  fs.writeFileSync(filePath, buffer);
  return filePath;
}

/**
 * Format currency for Turkish locale
 */
function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('tr-TR', {
    style: 'currency',
    currency: 'TRY',
    minimumFractionDigits: 2,
  }).format(amount);
}

/**
 * Format date for Turkish locale
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('tr-TR', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  }).format(date);
}

export default {
  generateProposal,
  generateInvoice,
  savePdf,
};
