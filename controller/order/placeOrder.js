import { OrderService } from "../../service/OrderService.js";

export const placeOrder = async (req, res) => {
  try {
    const { userId } = req.body;

    const data = await OrderService.placeOrder(userId);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};