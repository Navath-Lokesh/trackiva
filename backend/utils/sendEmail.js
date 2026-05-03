// const nodemailer = require("nodemailer");
// require("dotenv").config();

// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS, // App Password
//   },
// });

// const sendEmail = async (to, subject, html) => {
//   try {
//     console.log("📩 Sending email to:", to);

//     const info = await transporter.sendMail({
//       from: `Trackiva <${process.env.EMAIL_USER}>`,
//       // from: "Trackiva <onboarding@resend.dev>",
//       to: to,
//       subject: subject,
//       html: html,
//     });

//     console.log("✅ Email sent:", info.response);

//     return info;

//   } catch (error) {
//     console.error("❌ Email error:", error);
//     return null;
//   }
// };

// module.exports = sendEmail;



// const { Resend } = require("resend");

// const resend = new Resend(process.env.RESEND_API_KEY);

// const sendEmail = async (to, subject, html) => {
//   try {
//     console.log("📩 Sending email to:", to);

//     await resend.emails.send({
//       from: "Trackiva <onboarding@resend.dev>", // ✅ works always
//       to,
//       subject,
//       html,
//     });

//     console.log("✅ Email sent successfully");

//   } catch (error) {
//     console.error("❌ Email error:", error);
//   }
// };

// module.exports = sendEmail;


// brevo verison

const axios = require("axios");

const sendEmail = async (to, subject, htmlContent) => {
  try {
    console.log("📩 Sending email to:", to);

    const response = await axios.post(
      "https://api.brevo.com/v3/smtp/email",
      {
        sender: {
          name: process.env.SENDER_NAME,
          email: process.env.SENDER_EMAIL,
        },
        to: [{ email: to }],
        subject: subject,
        htmlContent: htmlContent,
      },
      {
        headers: {
          "api-key": process.env.BREVO_API_KEY,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("✅ Email sent via Brevo:", response.data);

  } catch (error) {
    console.error(
      "❌ Brevo Email Error:",
      error.response?.data || error.message
    );
  }
};

module.exports = sendEmail;