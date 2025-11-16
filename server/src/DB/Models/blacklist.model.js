import mongoose from "mongoose";
import { TOKEN_TYPES } from "../Constants/constants.js";

const blacklistTokenSchema = new mongoose.Schema(
  {
    tokenId: { type: String, required: true, unique: true },

    type: {
      type: String,
      enum: Object.values(TOKEN_TYPES),
      default: TOKEN_TYPES.ACCESS,
    },

    expiresAt: { type: Date, required: true },
  },
  { timestamps: true }
);

blacklistTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.BlacklistToken ||
  mongoose.model("BlacklistToken", blacklistTokenSchema);
