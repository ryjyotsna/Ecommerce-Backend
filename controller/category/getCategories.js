import { CategoryService } from "../../service/CategoryService.js";

export const getCategories = async (req, res) => {
  try {
    const data = await CategoryService.getCategories();

    return res.status(200).json({
      success: true,
      message: "Categories fetched successfully",
      data,
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to fetch categories",
      error: error.message,
    });
  }
};