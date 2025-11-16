import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      en: String,
      ar: String,
    },

    slug: {
      type: String,
      unique: true,
      lowercase: true,
    },
  },
  { timestamps: true }
);

export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
