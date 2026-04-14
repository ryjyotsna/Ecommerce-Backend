import Cart from "../model/cart.model.js";

export class CartService {
  static async addToCart(userId, productId) {
    let cart = await Cart.findOne({ userId });

    if (!cart) {
      cart = await Cart.create({ userId, items: [{ productId }] });
      return cart;
    }

    const item = cart.items.find(
      (i) => i.productId.toString() === productId
    );

    if (item) {
      item.quantity += 1;
    } else {
      cart.items.push({ productId });
    }

    await cart.save();
    return cart;
  }

  static async getCart(userId) {
    return await Cart.findOne({ userId }).populate("items.productId");
  }
}