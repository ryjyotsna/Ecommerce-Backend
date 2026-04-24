import mongoose from "mongoose";

const { Schema } = mongoose;

const invoiceSchema = new Schema(
  {
    orderId: {
      type: Schema.Types.ObjectId,
      ref: "Order",
      required: true,
      unique: true,
    },

    userId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    invoiceNo: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },

    s3Url: {
      type: String,
      trim: true,
    },

    s3Key: {
      type: String,
      trim: true,
    },

    pdfPath: {
      type: String,
      required: true,
      trim: true,
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
