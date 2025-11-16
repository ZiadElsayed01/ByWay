import mongoose from "mongoose";

const lessonSchema = new mongoose.Schema(
  {
    section_ID: mongoose.Schema.Types.ObjectId,

    title: { type: String, required: true },
    description: String,
    link: String,
    duration: Number,

    isCompleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

export default mongoose.models.Lesson || mongoose.model("Lesson", lessonSchema);
