import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

const DEFAULT_SELLER = {
  name: process.env.INVOICE_SELLER_NAME || "Your Store",
  gstin: process.env.INVOICE_SELLER_GSTIN || "N/A",
  address: process.env.INVOICE_SELLER_ADDRESS || "Seller address not configured",
  state: process.env.INVOICE_SELLER_STATE || "N/A",
};

const GST_RATE = Number(process.env.INVOICE_GST_RATE || 0.05);

export const generateInvoicePDF = (invoiceData) =>
  new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({ size: "A4", margin: 20 });
      const dir = "/tmp/invoices";
      fs.mkdirSync(dir, { recursive: true });

      const filePath = path.join(dir, `${invoiceData.invoiceNo}.pdf`);
      const stream = fs.createWriteStream(filePath);

      doc.pipe(stream);

      const logoPath = path.resolve(process.cwd(), "assets", "logo.jpg");
      const seller = invoiceData.seller || DEFAULT_SELLER;
      const buyer = invoiceData.buyer || {};
      const items = Array.isArray(invoiceData.items) ? invoiceData.items : [];

      doc.rect(20, 20, 555, 800).stroke();

      doc
        .font("Helvetica-Bold")
        .fontSize(10)
        .text(`GSTIN : ${seller.gstin || "N/A"}`, 30, 30);

      doc.fontSize(9).text("Original Copy", 483, 30);

      if (fs.existsSync(logoPath)) {
        doc.image(logoPath, 480, 38, { width: 70 });
      }

      const companyName = (seller.name || "Your Store").toUpperCase();
      const companyNameFontSize = companyName.length > 35 ? 13 : 16;
      const companyNameStartY = companyName.length > 35 ? 50 : 55;

      doc
        .font("Helvetica-Bold")
        .fontSize(companyNameFontSize)
        .text(companyName, 0, companyNameStartY, {
          align: "center",
          width: 555,
          height: 30,
        });

      doc
        .font("Helvetica")
        .fontSize(9)
        .text(seller.address || "", 0, 75, { align: "center" });

      doc
        .font("Helvetica-Bold")
        .fontSize(11)
        .text("TAX INVOICE", 0, 100, { align: "center" });

      doc.moveTo(20, 140).lineTo(575, 140).stroke();

      const leftX = 30;
      const rightX = 310;
      let y = 145;

      doc.fontSize(9).font("Helvetica");

      const leftLine = (label, value) => {
        doc.text(`${label} : ${value ?? ""}`, leftX, y);
        y += 14;
      };

      leftLine("Invoice No.", invoiceData.invoiceNo);
      leftLine("Date of Invoice", formatDate(invoiceData.invoiceDate));
      leftLine("Place of Supply", buyer.address?.state || "N/A");
      leftLine("Reverse Charge", "N");
      leftLine("Payment Status", invoiceData.paymentStatus || "PENDING");
      leftLine("Order Status", invoiceData.orderStatus || "PLACED");

      y = 145;
      const rightLine = (label, value) => {
        doc.text(`${label} : ${value ?? ""}`, rightX, y);
        y += 14;
      };

      rightLine("Customer", buyer.fullName || "N/A");
      rightLine("Phone", buyer.phoneNumber || "N/A");
      rightLine("Email", buyer.email || "N/A");
      rightLine("Order ID", String(invoiceData.orderId || ""));
      rightLine("Items", String(items.length));

      doc.moveTo(300, 140).lineTo(300, 260).stroke();
      doc.moveTo(20, 260).lineTo(575, 260).stroke();

      doc.font("Helvetica-Bold").text("Billed to :", 30, 270);
      doc.font("Helvetica").text(buyer.fullName || "N/A", 30, 285);
      doc.text(formatAddress(buyer.address), 30, 300, { width: 240 });

      doc.font("Helvetica-Bold").text("Shipped to :", 310, 270);
      doc.font("Helvetica").text(buyer.fullName || "N/A", 310, 285);
      doc.text(formatAddress(buyer.address), 310, 300, { width: 240 });

      doc.moveTo(20, 350).lineTo(575, 350).stroke();

      const cols = [20, 50, 290, 360, 430, 505, 575];
      const rowH = 22;
      let rowY = 350;

      cols.forEach((x) => doc.moveTo(x, rowY).lineTo(x, 580).stroke());
      doc.moveTo(20, rowY).lineTo(575, rowY).stroke();

      doc.font("Helvetica-Bold").fontSize(9);
      doc.text("S.N.", 25, rowY + 6);
      doc.text("Item / Description", 55, rowY + 6);
      doc.text("Qty", 300, rowY + 6);
      doc.text("Rate", 370, rowY + 6);
      doc.text("GST", 445, rowY + 6);
      doc.text("Amount", 510, rowY + 6);

      rowY += rowH;
      doc.moveTo(20, rowY).lineTo(575, rowY).stroke();

      let subTotal = 0;
      let gstTotal = 0;

      items.forEach((item, index) => {
        const taxable = Number(item.price || 0) * Number(item.quantity || 0);
        const gstAmount = Number(item.gstAmount ?? taxable * GST_RATE);
        const lineTotal = Number(item.total ?? taxable + gstAmount);

        subTotal += taxable;
        gstTotal += gstAmount;

        doc.font("Helvetica").fontSize(9);
        doc.text(String(index + 1), 25, rowY + 6);
        doc.text(item.name || "Product", 55, rowY + 6, { width: 225 });
        doc.text(String(item.quantity || 0), 300, rowY + 6);
        doc.text(toMoney(item.price || 0), 370, rowY + 6);
        doc.text(toMoney(gstAmount), 445, rowY + 6);
        doc.text(toMoney(lineTotal), 510, rowY + 6);

        rowY += rowH;
        doc.moveTo(20, rowY).lineTo(575, rowY).stroke();
      });

      doc.moveTo(20, 580).lineTo(575, 580).stroke();

      const grandTotal = Number(invoiceData.amount ?? subTotal + gstTotal);

      doc.font("Helvetica-Bold").fontSize(10);
      doc.text("Sub Total", 360, 590);
      doc.text(`Rs. ${toMoney(subTotal)}`, 500, 590);
      doc.text("GST Total", 360, 605);
      doc.text(`Rs. ${toMoney(gstTotal)}`, 500, 605);
      doc.text("Grand Total", 360, 620);
      doc.text(`Rs. ${toMoney(grandTotal)}`, 500, 620);

      doc.moveTo(20, 650).lineTo(575, 650).stroke();

      doc
        .font("Helvetica-Bold")
        .text(`Rupees ${numberToWords(grandTotal)} Only`, 30, 665);

      doc.moveTo(20, 700).lineTo(575, 700).stroke();
      doc.moveTo(350, 700).lineTo(350, 770).stroke();

      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .text("Terms & Conditions", 30, 710);

      doc.font("Helvetica").fontSize(8);
      doc.text("1. This invoice is generated against a placed order.", 30, 725);
      doc.text("2. Please retain this document for support and returns.", 30, 738);
      doc.text("3. Taxes are applied as per the configured GST rate.", 30, 751, {
        width: 300,
      });

      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .text(`for ${seller.name || "Your Store"}`, 370, 725);

      doc.text("Authorised Signatory", 370, 745);

      doc.moveTo(20, 770).lineTo(575, 770).stroke();

      doc.font("Helvetica").fontSize(8).text(
        "This is a computer-generated invoice.",
        0,
        785,
        { align: "center" }
      );

      doc.end();

      stream.on("finish", () => {
        if (!fs.existsSync(filePath)) {
          reject(new Error(`PDF file not created at ${filePath}`));
          return;
        }

        resolve(filePath);
      });

      stream.on("error", (error) => {
        reject(new Error(`Failed to write PDF: ${error.message}`));
      });

      doc.on("error", (error) => {
        reject(new Error(`Failed to generate PDF: ${error.message}`));
      });
    } catch (error) {
      reject(error);
    }
  });

function formatDate(value) {
  const date = value instanceof Date ? value : new Date(value);
  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-IN");
}

function formatAddress(address = {}) {
  return [
    address.street,
    address.city,
    address.state,
    address.pincode,
    address.country,
  ]
    .filter(Boolean)
    .join(", ");
}

function toMoney(value) {
  return Number(value || 0).toFixed(2);
}

function numberToWords(num) {
  const ones = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];

  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  const convert = (value) => {
    if (value < 20) return ones[value];
    if (value < 100) {
      return tens[Math.floor(value / 10)] + (value % 10 ? ` ${ones[value % 10]}` : "");
    }
    if (value < 1000) {
      return (
        `${ones[Math.floor(value / 100)]} Hundred` +
        (value % 100 ? ` ${convert(value % 100)}` : "")
      );
    }
    if (value < 100000) {
      return (
        `${convert(Math.floor(value / 1000))} Thousand` +
        (value % 1000 ? ` ${convert(value % 1000)}` : "")
      );
    }

    return (
      `${convert(Math.floor(value / 100000))} Lakh` +
      (value % 100000 ? ` ${convert(value % 100000)}` : "")
    );
  };

  return convert(Math.floor(Number(num) || 0)).trim();
}
