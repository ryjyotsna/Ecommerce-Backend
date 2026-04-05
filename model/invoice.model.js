import mongoose from "mongoose";

const { Schema } = mongoose;

const invoiceSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    s3Url: {
      type: String,
      unique: true,
    },

    s3Key: {
      type: String,
      unique: true,
    },

    issuedAt: {
      type: Date,
      default: Date.now,
    },

    amount: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Invoice", invoiceSchema);