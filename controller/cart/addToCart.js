import { CartService } from "../../service/CartService.js";

export const addToCart = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    const data = await CartService.addToCart(userId, productId);

    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};