import Product from "../model/product.model.js";
import Category from "../model/category.model.js";

export class ProductService {
  static async createProduct(data) {
    const { name, price, category } = data;

    const categoryExists = await Category.findById(category);
    if (!categoryExists) {
      throw new Error("Category not found");
    }

    return await Product.create(data);
  }

  static async getProducts() {
    return await Product.find().populate("category");
  }

  static async getProductById(id) {
    const product = await Product.findById(id).populate("category");
    if (!product) throw new Error("Product not found");
    return product;
  }
}