import Invoice from "../model/invoice.model.js";
import Order from "../model/order.model.js";
import User from "../model/user.model.js";
import { generateInvoicePDF } from "../utils/generateInvoicePdf.js";

export class InvoiceService {
  static async generateInvoice(orderId) {
    const existingInvoice = await Invoice.findOne({ orderId });
    if (existingInvoice) {
      return existingInvoice;
    }

    const order = await Order.findById(orderId).populate("items.productId");
    if (!order) {
      throw new Error("Order not found");
    }

    const user = await User.findById(order.userId);
    if (!user) {
      throw new Error("User not found for this order");
    }

    const invoiceNo = this.createInvoiceNo(order);
    const items = order.items.map((item) => {
      const product = item.productId;
      const quantity = Number(item.quantity || 0);
      const price = Number(item.price ?? product?.price ?? 0);
      const taxableAmount = price * quantity;
      const gstAmount = 0;

      return {
        productId: product?._id || item.productId,
        name: product?.name || "Product",
        quantity,
        price,
        taxableAmount,
        gstAmount,
        total: taxableAmount + gstAmount,
      };
    });

    const pdfPath = await generateInvoicePDF({
      invoiceNo,
      orderId: order._id,
      invoiceDate: order.createdAt,
      orderStatus: order.orderStatus,
      paymentStatus: order.paymentStatus,
      amount: order.totalAmount,
      buyer: {
        fullName: user.fullName,
        email: user.email,
        phoneNumber: user.phoneNumber,
        address: user.address,
      },
      items,
    });

    return Invoice.create({
      orderId: order._id,
      userId: order.userId,
      invoiceNo,
      amount: order.totalAmount,
      pdfPath,
      s3Url: pdfPath,
      s3Key: invoiceNo,
    });
  }

  static createInvoiceNo(order) {
    const date = new Date(order.createdAt || Date.now());
    const datePart = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("");

    return `INV-${datePart}-${String(order._id).slice(-6).toUpperCase()}`;
  }
}
