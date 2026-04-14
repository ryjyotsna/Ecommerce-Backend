import { CartService } from "../../service/CartService.js";

export const getCart = async (req, res) => {
  try {
    const { userId } = req.params;
    const data = await CartService.getCart(userId);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};