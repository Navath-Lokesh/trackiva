const { Resend } = require("resend");
require("dotenv").config();

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    console.log("📩 Attempting to send email to:", to);

    // Check API key
    if (!process.env.RESEND_API_KEY) {
      console.error("❌ RESEND_API_KEY is missing");
      return;
    }

    const response = await resend.emails.send({
      from: "Trackiva <onboarding@resend.dev>",
      to: [to],
      subject: subject,
      html: html,
    });

    console.log("✅ Email sent successfully:", response);

  } catch (error) {
    console.error("❌ Email error:", error);
  }
};

module.exports = sendEmail;