import { Schema, model, Document } from "mongoose";

const userSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone_number: { type: String, unique: true },
    password: { type: String},
    verified: { type: Boolean, default: false },
    role: {type: String, default: "User"},
    location: {
      type: {
        type: String,
        enum: ["Point"],
      },
      coordinates: {
        type: [Number],
      },
    },
    vehicleType:  { type: String, unique: true },
  },
  { timestamps: true }
);
userSchema.index({ location: "2dsphere" });

const User = model("User", userSchema);

export default User;
