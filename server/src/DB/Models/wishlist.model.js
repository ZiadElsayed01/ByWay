import mongoose from "mongoose";

const wishlistSchema = new mongoose.Schema(
  {
    student_ID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    course_ID: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  },
  { timestamps: true }
);

export default mongoose.models.Wishlist ||
  mongoose.model("Wishlist", wishlistSchema);
