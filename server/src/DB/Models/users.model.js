import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },

    headLine: String,
    bio: String,

    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    image: String,

    language: {
      type: String,
      enum: ["en", "ar"],
      default: "en",
    },

    links: {
      type: [String],
      default: [],
    },

    role: {
      type: String,
      enum: ["student", "instructor", "admin"],
      default: "student",
    },

    isPrivate: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    verificationOtpExpiry: Date,
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
