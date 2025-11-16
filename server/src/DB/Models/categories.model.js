import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
  {
    name: {
      en: String,
      ar: String,
    },
    slug: String,
  },
  { timestamps: true }
);

export default mongoose.models.Category ||
  mongoose.model("Category", categorySchema);
