import mongoose from "mongoose";

const blacklistTokenSchema = new mongoose.Schema(
  {
    token: {
      type: String,
      required: true,
      unique: true,
    },

    type: {
      type: String,
      enum: ["access", "refresh"],
      default: "access",
    },

    expiresAt: {
      type: Date,
      required: true,
    },
  },
  { timestamps: true }
);

// TTL Index → document auto-delete after expiration
blacklistTokenSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export default mongoose.models.BlacklistToken ||
  mongoose.model("BlacklistToken", blacklistTokenSchema);
