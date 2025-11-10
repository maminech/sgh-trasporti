const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

class InvoicePDFService {
  /**
   * Generate a PDF invoice
   * @param {Object} invoice - Invoice data
   * @param {String} outputPath - Path to save the PDF
   * @returns {Promise<String>} - Path to generated PDF
   */
  static async generateInvoicePDF(invoice, outputPath) {
    return new Promise((resolve, reject) => {
      try {
        // Create uploads directory if it doesn't exist
        const uploadsDir = path.join(__dirname, '../../uploads/invoices');
        if (!fs.existsSync(uploadsDir)) {
          fs.mkdirSync(uploadsDir, { recursive: true });
        }

        const filePath = path.join(uploadsDir, outputPath);
        const doc = new PDFDocument({ margin: 50, size: 'A4' });
        const writeStream = fs.createWriteStream(filePath);

        doc.pipe(writeStream);

        // Company Header
        this.generateHeader(doc);
        
        // Invoice Details
        this.generateInvoiceInfo(doc, invoice);
        
        // Customer Information
        this.generateCustomerInfo(doc, invoice);
        
        // Invoice Items Table
        this.generateInvoiceTable(doc, invoice);
        
        // Footer with totals
        this.generateFooter(doc, invoice);
        
        // Payment Information
        this.generatePaymentInfo(doc, invoice);

        // Finalize PDF
        doc.end();

        writeStream.on('finish', () => {
          resolve(filePath);
        });

        writeStream.on('error', (error) => {
          reject(error);
        });

      } catch (error) {
        reject(error);
      }
    });
  }

  static generateHeader(doc) {
    doc
      .fillColor('#1e40af')
      .fontSize(24)
      .font('Helvetica-Bold')
      .text('SGH TRASPORTI', 50, 50)
      .fontSize(10)
      .fillColor('#666666')
      .font('Helvetica')
      .text('Via Example 123', 50, 80)
      .text('Milano, 20100, Italy', 50, 95)
      .text('Tel: +39 02 1234 5678', 50, 110)
      .text('Email: service.sgh.trasporti@hotmail.com', 50, 125)
      .text('P.IVA: IT12345678901', 50, 140)
      .moveDown();
  }

  static generateInvoiceInfo(doc, invoice) {
    const invoiceInfoTop = 50;

    doc
      .fillColor('#1e40af')
      .fontSize(20)
      .font('Helvetica-Bold')
      .text('FATTURA', 400, invoiceInfoTop, { align: 'right' })
      .fontSize(10)
      .fillColor('#666666')
      .font('Helvetica')
      .text(`N°: ${invoice.invoiceNumber}`, 400, invoiceInfoTop + 30, { align: 'right' })
      .text(
        `Data Emissione: ${new Date(invoice.issueDate).toLocaleDateString('it-IT')}`,
        400,
        invoiceInfoTop + 45,
        { align: 'right' }
      )
      .text(
        `Data Scadenza: ${new Date(invoice.dueDate).toLocaleDateString('it-IT')}`,
        400,
        invoiceInfoTop + 60,
        { align: 'right' }
      );
  }

  static generateCustomerInfo(doc, invoice) {
    const customerTop = 180;

    doc
      .fontSize(12)
      .fillColor('#1e40af')
      .font('Helvetica-Bold')
      .text('DESTINATARIO:', 50, customerTop)
      .fontSize(10)
      .fillColor('#333333')
      .font('Helvetica')
      .text(invoice.customerDetails.name || 'N/A', 50, customerTop + 20)
      .text(invoice.customerDetails.company || '', 50, customerTop + 35);

    if (invoice.customerDetails.address) {
      const addr = invoice.customerDetails.address;
      doc
        .text(addr.street || '', 50, customerTop + 50)
        .text(
          `${addr.postalCode || ''} ${addr.city || ''}, ${addr.country || ''}`,
          50,
          customerTop + 65
        );
    }

    if (invoice.customerDetails.vatNumber) {
      doc.text(`P.IVA: ${invoice.customerDetails.vatNumber}`, 50, customerTop + 85);
    }
    if (invoice.customerDetails.fiscalCode) {
      doc.text(`C.F.: ${invoice.customerDetails.fiscalCode}`, 50, customerTop + 100);
    }

    doc.moveDown(2);
  }

  static generateInvoiceTable(doc, invoice) {
    const tableTop = 340;
    const descriptionX = 50;
    const quantityX = 280;
    const priceX = 340;
    const taxX = 410;
    const totalX = 480;

    // Table Header
    doc
      .fillColor('#1e40af')
      .fontSize(10)
      .font('Helvetica-Bold')
      .text('DESCRIZIONE', descriptionX, tableTop)
      .text('QTÀ', quantityX, tableTop)
      .text('PREZZO', priceX, tableTop)
      .text('IVA%', taxX, tableTop)
      .text('TOTALE', totalX, tableTop);

    // Draw header line
    doc
      .strokeColor('#1e40af')
      .lineWidth(1)
      .moveTo(50, tableTop + 15)
      .lineTo(550, tableTop + 15)
      .stroke();

    // Table Items
    let y = tableTop + 30;
    doc.fillColor('#333333').font('Helvetica').fontSize(9);

    invoice.items.forEach((item) => {
      if (y > 700) {
        doc.addPage();
        y = 50;
      }

      doc
        .text(item.description, descriptionX, y, { width: 220, align: 'left' })
        .text(item.quantity.toString(), quantityX, y, { width: 50, align: 'right' })
        .text(`€${item.unitPrice.toFixed(2)}`, priceX, y, { width: 60, align: 'right' })
        .text(`${item.taxRate}%`, taxX, y, { width: 60, align: 'right' })
        .text(`€${item.total.toFixed(2)}`, totalX, y, { width: 70, align: 'right' });

      y += 25;
    });

    return y;
  }

  static generateFooter(doc, invoice) {
    const subtotalY = 650;

    // Draw totals box
    doc
      .strokeColor('#e5e7eb')
      .lineWidth(1)
      .rect(350, subtotalY - 10, 200, 100)
      .stroke();

    doc
      .fontSize(10)
      .fillColor('#666666')
      .font('Helvetica')
      .text('Imponibile:', 360, subtotalY)
      .text('IVA:', 360, subtotalY + 20)
      .fontSize(12)
      .fillColor('#1e40af')
      .font('Helvetica-Bold')
      .text('TOTALE:', 360, subtotalY + 45);

    doc
      .fontSize(10)
      .fillColor('#666666')
      .font('Helvetica')
      .text(`€${invoice.subtotal.toFixed(2)}`, 480, subtotalY, { align: 'right' })
      .text(`€${invoice.taxAmount.toFixed(2)}`, 480, subtotalY + 20, { align: 'right' })
      .fontSize(12)
      .fillColor('#1e40af')
      .font('Helvetica-Bold')
      .text(`€${invoice.totalAmount.toFixed(2)}`, 480, subtotalY + 45, { align: 'right' });
  }

  static generatePaymentInfo(doc, invoice) {
    doc
      .fontSize(9)
      .fillColor('#666666')
      .font('Helvetica')
      .text('MODALITÀ DI PAGAMENTO', 50, 770)
      .text('Bonifico Bancario', 50, 785)
      .text('IBAN: IT60 X054 2811 1010 0000 0123 456', 50, 800)
      .text('BIC: BPMOIT22XXX', 50, 815);

    if (invoice.notes) {
      doc
        .fontSize(8)
        .text('Note:', 50, 835)
        .text(invoice.notes, 50, 845, { width: 500 });
    }
  }
}

module.exports = InvoicePDFService;
