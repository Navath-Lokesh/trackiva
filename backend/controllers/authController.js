const User = require("../models/User");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const jwt = require("jsonwebtoken");

// ================= REGISTER =================
const registerUser = async (req, res) => {
  try {
    const { name, email, password, dateOfBirth } = req.body;

    // 🔍 Check existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    // 🔐 Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 🔑 Generate verification token (not used now)
    const verificationToken = crypto.randomBytes(32).toString("hex");

    // 🌐 Verification URL (not used now)
    const verificationUrl = `${process.env.BASE_URL}/api/auth/verify-email/${verificationToken}`;

    // 👤 Create user
    const newUser = new User({
      name,
      email,
      password: hashedPassword,
      dateOfBirth,
      emailVerificationToken: verificationToken, // (kept for future use)
      isVerified: true // ✅ TEMP: auto verified
    });

    await newUser.save();

    // 📧 Email sending (DISABLED FOR NOW)
    /*
    await sendEmail(
      email,
      "Verify your Trackiva account",
      `
      <h2>Welcome to Trackiva</h2>
      <p>Click the button below to verify your email:</p>

      <a href="${verificationUrl}" 
         style="background:#4CAF50;color:white;padding:10px 20px;text-decoration:none;border-radius:5px;">
         Verify Email
      </a>

      <p>If the button does not work, copy this link:</p>
      <p>${verificationUrl}</p>
      `
    );
    */

    res.status(201).json({
      message: "User registered successfully 🚀",
      note: "Email verification coming soon 🚀" // ✅ ADDED
    });

  } catch (error) {
    console.error("Register Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

// ================= VERIFY EMAIL =================
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({ emailVerificationToken: token });

    if (!user) {
      return res.redirect(`${process.env.FRONTEND_URL}/?error=invalid_token`);
    }

    user.isVerified = true;
    user.emailVerificationToken = undefined;

    await user.save();

    // ✅ Redirect to frontend verify page
    res.redirect(`${process.env.FRONTEND_URL}/verify`);

  } catch (error) {
    console.error("Verify Email Error:", error);
    res.redirect(`${process.env.FRONTEND_URL}/?error=server_error`);
  }
};

// ================= LOGIN =================
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // ❌ TEMP DISABLED (since all users are verified)
    /*
    if (!user.isVerified) {
      return res.status(400).json({ message: "Please verify your email first" });
    }
    */

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      message: "Login successful",
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt
      }
    });

  } catch (error) {
    console.error("Login Error:", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
};

module.exports = { registerUser, verifyEmail, loginUser };