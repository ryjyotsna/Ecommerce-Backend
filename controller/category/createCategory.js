import { CategoryService } from "../../service/CategoryService.js";

export const createCategory = async (req, res) => {
  try {
    // console.log("BODY:", req.body);
    const { name, description } = req.body;
    console.log("NAME:", name);

    // Validation
    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Category name is required",
      });
    }

    const data = await CategoryService.createCategory(req.body);

    return res.status(201).json({
      success: true,
      message: "Category created successfully",
      data,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to create category",
      error: error.message,
    });
  }
};