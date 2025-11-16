import mongoose from "mongoose";
import { COURSE_STATUS } from "../Constants/constants.js";

const courseSchema = new mongoose.Schema(
  {
    image: String,
    title: { type: String, required: true },
    subTitle: String,
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User" },

    rate: { type: Number, default: 0 },

    students: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    description: String,
    requirements: [String],

    content: [
      {
        sectionID: mongoose.Schema.Types.ObjectId,
        lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: "Lesson" }],
      },
    ],

    status: {
      type: String,
      enum: Object.values(COURSE_STATUS),
      default: COURSE_STATUS.DRAFT,
    },

    price: Number,
    discount: Number,

    reviews: [{ type: mongoose.Schema.Types.ObjectId, ref: "Review" }],

    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },

    isFavourite: { type: Boolean, default: false },
    progress: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default mongoose.models.Course || mongoose.model("Course", courseSchema);
