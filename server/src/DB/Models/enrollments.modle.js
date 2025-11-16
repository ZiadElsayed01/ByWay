import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    student_ID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    course_ID: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
  },
  { timestamps: true }
);

export default mongoose.models.Enrollment ||
  mongoose.model("Enrollment", enrollmentSchema);
