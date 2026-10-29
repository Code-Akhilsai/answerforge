import { User } from "../models/user.models.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

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

    return res
      .status(200)
      .cookie("token", token, {
        httpOnly: true,
        secure: false,
        sameSite: "lax",
      })
      .json({
        message: "Login successful",
        user: { fullName: user.fullName, email: user.email },
      });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
};

export { userController, userloginController };
export default { userController, userloginController };
