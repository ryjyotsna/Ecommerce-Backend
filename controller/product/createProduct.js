import { ProductService } from "../../service/ProductService.js";

export const createProduct = async (req, res) => {
  try {
    const { name, price, category } = req.body;

    if (!name || !price || !category) {
      return res.status(400).json({
        success: false,
        message: "Name, price, category required",
      });
    }

    const data = await ProductService.createProduct(req.body);

    res.status(201).json({
      success: true,
      data,
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};