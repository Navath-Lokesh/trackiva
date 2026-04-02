const { Resend } = require("resend");
require("dotenv").config();

// ✅ Validate API key at startup (better than checking every time)
if (!process.env.RESEND_API_KEY) {
  throw new Error("❌ RESEND_API_KEY is missing in .env");
}

// Initialize Resend
const resend = new Resend(process.env.RESEND_API_KEY);

const sendEmail = async (to, subject, html) => {
  try {
    console.log("📩 Sending email to:", to);

    const response = await resend.emails.send({
      // ⚠️ IMPORTANT:
      // Replace this with your VERIFIED email in Resend dashboard
      from: `Trackiva <${process.env.EMAIL_USER}>`,

      to: [to], // keep as array
      subject: subject,
      html: html,
    });

    console.log("✅ Email sent successfully:", response);

    return response;

  } catch (error) {
    console.error("❌ Email error:", error);

    // Return null instead of crashing server
    return null;
  }
};

module.exports = sendEmail;