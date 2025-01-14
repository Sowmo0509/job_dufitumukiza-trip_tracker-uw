import mongoose from "mongoose";

const tokenBlacklistSchema = new mongoose.Schema(
  {
    token: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model("TokenBlacklist", tokenBlacklistSchema);
