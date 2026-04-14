import Invoice from "../model/invoice.model.js";

export class InvoiceService {
  static async generateInvoice(order) {
    return await Invoice.create({
      orderId: order._id,
      userId: order.userId,
      amount: order.totalAmount,
      s3Url: "dummy-url",
      s3Key: "dummy-key",
    });
  }
}