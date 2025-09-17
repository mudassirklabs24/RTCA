import mongoose, { Schema, model } from "mongoose";

const userSchema = Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    confirmPassword: {
      type: String,
      required: true,
      trim: true,
    },
    countryCode: { type: String, required: true },
    phoneNumber: {
      type: Number,
      required: true,
      trim: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    otp: {
      type: String,
      trim: true,
    },
    chats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chat",
      },
    ],
  },
  { timestamps: true }
);

export default model("user", userSchema);
