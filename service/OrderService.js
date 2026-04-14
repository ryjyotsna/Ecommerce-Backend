import Order from "../model/order.model.js";
import Cart from "../model/cart.model.js";

export class OrderService {
  static async placeOrder(userId) {
    const cart = await Cart.findOne({ userId }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      throw new Error("Cart is empty");
    }

    let totalAmount = 0;

    const items = cart.items.map((item) => {
      const price = item.productId.price;
      totalAmount += price * item.quantity;

      return {
        productId: item.productId._id,
        quantity: item.quantity,
        price,
      };
    });

    const order = await Order.create({
      userId,
      cartId: cart._id,
      items,
      totalAmount,
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    return order;
  }
}