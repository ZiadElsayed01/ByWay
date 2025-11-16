import mongoose from "mongoose";
import { ORDER_STATUS, PAYMENT_METHODS } from "../Constants/constants.js";

const orderSchema = new mongoose.Schema(
  {
    student_ID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    course_ID: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },

    amount: Number,

    status: {
      type: String,
      enum: Object.values(ORDER_STATUS),
      default: ORDER_STATUS.PENDING,
    },

    paymentMethod: {
      type: String,
      enum: Object.values(PAYMENT_METHODS),
    },

    coupon_ID: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", orderSchema);
