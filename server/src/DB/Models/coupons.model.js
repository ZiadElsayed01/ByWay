import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
  {
    code: { type: String, required: true, unique: true },

    percentage: Number,

    from: Date,
    until: Date,

    isActive: { type: Boolean, default: true },

    limit: Number,
    used: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Coupon || mongoose.model("Coupon", couponSchema);
