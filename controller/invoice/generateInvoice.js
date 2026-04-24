import { InvoiceService } from "../../service/InvoiceService.js";

export const generateInvoice = async (req, res) => {
  try {
    const { orderId } = req.body;
    if (!orderId) {
      return res
        .status(400)
        .json({ success: false, error: "orderId is required" });
    }

    const data = await InvoiceService.generateInvoice(orderId);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};
