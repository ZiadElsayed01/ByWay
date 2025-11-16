import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    student_ID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    course_ID: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },

    rate: { type: Number, min: 1, max: 5 },
    comment: String,
  },
  { timestamps: true }
);

export default mongoose.models.Review || mongoose.model("Review", reviewSchema);
