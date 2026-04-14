import { InvoiceService } from "../../service/InvoiceService.js";

export const generateInvoice = async (req, res) => {
  try {
    const { order } = req.body;

    const data = await InvoiceService.generateInvoice(order);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};