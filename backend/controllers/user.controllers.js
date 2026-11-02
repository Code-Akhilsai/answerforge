import { User } from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";

const userController = async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password)
      return res
        .status(400)
        .json({ message: "Please provide complete details" });

    const user = await User.findOne({ email });

    if (user)
      return res
        .status(403)
        .json({ message: "User already exists. Please login" });

    const hashpass = await bcrypt.hash(password, 10);

    const new_user = await User.create({ fullName, email, password: hashpass });

    if (!new_user) return res.status(500).json({ message: "User not created" });

    return res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    return res
      .status(500)
      .json({ message: error.message || "Internal server error" });
  }
};

const userloginController = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Please provide complete details" });

    const user = await User.findOne({ email });

    if (!user) return res.status(404).json({ message: "User not found" });

    const isMatched = await bcrypt.compare(password, user.password);

    if (!isMatched)
      return res.status(409).json({ message: "Invalid credentials" });

    // token
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    if (!token) return res.status(403).json({ message: "Please login again" });

    // Set cookie with cross-site-safe attributes over HTTPS
    const isSecure = req.protocol === "https" || req.headers["x-forwarded-proto"] === "https";

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: isSecure,
        sameSite: isSecure ? "none" : "lax",
        path: "/",
      })
      .json({
        message: "Login successful",
        user: { fullName: user.fullName, email: user.email },
      });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

const googleAuthController = async (req, res) => {
  try {
    const { fullName, email, googleId, photoURL } = req.body;

    if (!email) {
      return res
        .status(400)
        .json({ message: "Google account email is required" });
    }

    const normalizedEmail = email.toLowerCase().trim();
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      // Create new user in MongoDB
      const fallbackPassword = await bcrypt.hash(
        (googleId || "google-auth") +
          (process.env.JWT_SECRET || "answerforge_secret"),
        10,
      );

      user = await User.create({
        fullName: fullName || normalizedEmail.split("@")[0] || "Candidate",
        email: normalizedEmail,
        password: fallbackPassword,
        googleId: googleId || null,
        photoURL: photoURL || null,
        authProvider: "google",
      });
    } else {
      // Update googleId and photoURL if not already set
      let updated = false;
      if (googleId && !user.googleId) {
        user.googleId = googleId;
        updated = true;
      }
      if (photoURL && !user.photoURL) {
        user.photoURL = photoURL;
        updated = true;
      }
      if (updated) {
        await user.save();
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { _id: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // Set cookie with cross-site-safe attributes over HTTPS
    const isSecure = req.protocol === "https" || req.headers["x-forwarded-proto"] === "https";

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: isSecure,
        sameSite: isSecure ? "none" : "lax",
        path: "/",
      })
      .json({
        message: "Google login successful",
        user: {
          fullName: user.fullName,
          email: user.email,
          photoURL: user.photoURL || null,
        },
      });
  } catch (error) {
    console.error("Google auth error:", error);
    return res.status(500).json({
      message: error.message || "Failed to authenticate with Google",
    });
  }
};

const forgotPasswordController = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email)
      return res
        .status(400)
        .json({ message: "Please provide your email address" });

    const user = await User.findOne({ email: email.toLowerCase().trim() });

    if (!user)
      return res
        .status(404)
        .json({ message: "No account found with this email address" });

    // Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes
    await user.save();

    // In production, send this token via email. Returned here for demo.
    return res.status(200).json({
      message: "Password reset token generated",
      resetToken,
      email: user.email,
    });
  } catch (error) {
    console.error("Forgot password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const resetPasswordController = async (req, res) => {
  try {
    const { token } = req.params;
    const { password } = req.body;

    if (!password)
      return res.status(400).json({ message: "New password is required" });

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user)
      return res
        .status(400)
        .json({ message: "Invalid or expired reset token" });

    user.password = await bcrypt.hash(password, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.error("Reset password error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

export {
  userController,
  userloginController,
  googleAuthController,
  forgotPasswordController,
  resetPasswordController,
};
export default {
  userController,
  userloginController,
  googleAuthController,
  forgotPasswordController,
  resetPasswordController,
};
