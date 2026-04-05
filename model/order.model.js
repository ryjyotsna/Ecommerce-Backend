import mongoose from 'mongoose';
 
const { Schema } = mongoose;

const orderSchema = new Schema(
    {
    cartId: {
      type: Schema.Types.ObjectId,
      ref: "Cart",
      required: true,
    },
    userId: {
      type: Schema.Types.ObjectId,
      ref: "User", 
        required: true,
    },
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        quantity: {
          type: Number,
          price: Number, 
        },
    },
    ],
    totalAmount: {
      type: Number,
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: ["PENDING", "COMPLETED", "FAILED"],
      default: "PENDING",
    },
    orderStatus: {
      type: String,
      enum: ["PLACED", "SHIPPED", "DELIVERED", "CANCELLED"],
      default: "PLACED",
    },

    }, { timestamps: true }
);

export default mongoose.model('Order', orderSchema);