import genToken from "../config/token.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 🔍 Email already exists check
    const existEmail = await User.findOne({ email });
    if (existEmail) {
      return res.status(400).json({ message: "Email already exists!" });
    }

    if (!password || password.length < 6) {
      return res.status(400).json({ message: "Password must be at least 6 characters!" });
    }

    // 🔒 Password hash
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashedPassword });

    // 🔑 Token generate
    const token = await genToken(user._id);

    // 🍪 Set cookie properly
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax", // localhost par "lax"
      secure: false,   // only true in production (https)
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(201).json({
      message: "Signup successful",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Signup Error:", error);
    return res.status(500).json({ message: `Signup error: ${error.message}` });
  }
};


export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // 🔍 User check
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Email does not exist!" });

    // 🔒 Password compare
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Incorrect password!" });
    }

    // 🔑 Token generate
    const token = await genToken(user._id);

    // 🍪 Set cookie properly
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      message: "Login successful",
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    console.error("Login Error:", error);
    return res.status(500).json({ message: `Login error: ${error.message}` });
  }
};


export const logOut = async (req, res) => {
  try {
    res.clearCookie("token", { httpOnly: true, sameSite: "lax", secure: false });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.error("Logout Error:", error);
    return res.status(500).json({ message: `Logout error: ${error.message}` });
  }
};
