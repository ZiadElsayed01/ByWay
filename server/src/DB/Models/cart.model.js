import mongoose from "mongoose";

const cartSchema = new mongoose.Schema(
  {
    student_ID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    course_ID: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  },
  { timestamps: true }
);

export default mongoose.models.Cart || mongoose.model("Cart", cartSchema);
