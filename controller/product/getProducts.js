import { ProductService } from "../../service/ProductService.js";

export const getProducts = async (req, res) => {
  try {
    const data = await ProductService.getProducts();
    res.json({ success: true, data });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};