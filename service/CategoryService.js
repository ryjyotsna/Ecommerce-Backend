import Category from "../model/category.model.js";

export class CategoryService {

  static async createCategory(data) {
    const { name, description } = data;

    const existingCategory = await Category.findOne({ name });

    if (existingCategory) {
      throw new Error("Category already exists");
    }

    const category = await Category.create({
      name,
      description,
    });

    return category;
  }


  static async getCategories() {
    const categories = await Category.find().sort({ createdAt: -1 });
    return categories;
  }
}