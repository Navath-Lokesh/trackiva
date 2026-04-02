const nodemailer = require("nodemailer");
require("dotenv").config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS, // App Password
  },
});

const sendEmail = async (to, subject, html) => {
  try {
    console.log("📩 Sending email to:", to);

    const info = await transporter.sendMail({
      // from: `Trackiva <${process.env.EMAIL_USER}>`,
      from: "Trackiva <onboarding@resend.dev>",
      to: to,
      subject: subject,
      html: html,
    });

    console.log("✅ Email sent:", info.response);

    return info;

  } catch (error) {
    console.error("❌ Email error:", error);
    return null;
  }
};

module.exports = sendEmail;