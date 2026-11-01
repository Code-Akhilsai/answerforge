import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    fullName: {
      type: String,
      required: [true, "Full name is required"],
      trim: true,
      minLength: [2, "Full name must be at least 2 characters long"],
    },

    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid email address",
      ],
    },

    password: {
      type: String,
      required: false,
    },

    googleId: {
      type: String,
      default: null,
    },

    photoURL: {
      type: String,
      default: null,
    },

    authProvider: {
      type: String,
      enum: ["local", "google"],
      default: "local",
    },

    practiceSessions: [
      {
        sessionId: { type: String },
        title: { type: String },
        question: { type: String },
        track: { type: String },
        trackLabel: { type: String },
        company: { type: String },
        score: { type: Number },
        evaluation: { type: String },
        date: { type: String },
        duration: { type: String },
        pace: { type: String },
        fillers: { type: String },
        fillerDensity: { type: String },
        statusColor: { type: String },
        transcript: { type: String },
        strengths: [{ type: String }],
        improvements: [{ type: String }],
        modelAnswer: { type: String },
      },
    ],

    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },
  },
  {
    timestamps: true,
  },
);

export const User = mongoose.model("User", userSchema);
