import mongoose from "mongoose";
import { USER_ROLES, LANGUAGE_TYPES } from "../../Constants/constants.js";

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
      enum: Object.values(LANGUAGE_TYPES),
      default: LANGUAGE_TYPES.EN,
    },

    links: { type: [String], default: [] },

    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.STUDENT,
    },

    isPrivate: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    verificationToken: String,
    verificationTokenExpiry: Date,
  },
  { timestamps: true }
);

export default mongoose.models.User || mongoose.model("User", userSchema);
