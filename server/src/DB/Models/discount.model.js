import mongoose from "mongoose";

const discountCoursesSchema = new mongoose.Schema(
  {
    coupon_ID: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
    course_ID: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  },
  { timestamps: true }
);

export default mongoose.models.DiscountCourse ||
  mongoose.model("DiscountCourse", discountCoursesSchema);
