import { ProductService } from "../../service/ProductService.js";

export const getProductById = async (req, res) => {
  try {
    const data = await ProductService.getProductById(req.params.id);
    res.json({ success: true, data });
  } catch (error) {
    res.status(404).json({ success: false, error: error.message });
  }
};