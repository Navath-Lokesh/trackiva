const nodemailer = require("nodemailer");
const dns = require("dns");


// ✅ ADDED: Load environment variables (IMPORTANT)
require("dotenv").config(); // 🔥 MUST for accessing EMAIL_USER & EMAIL_PASS

const sendEmail = async (to, subject, html) => {

  try {

    console.log("📩 Attempting to send email to:", to);

    // ✅ ADDED: Debug logs (to verify env is loaded)
    console.log("EMAIL_USER:", process.env.EMAIL_USER);
    console.log("EMAIL_PASS:", process.env.EMAIL_PASS ? "Loaded ✅" : "Missing ❌");

    // const transporter = nodemailer.createTransport({
    //   service: "gmail",
    //   auth: {
    //     user: process.env.EMAIL_USER, // ✅ now will work
    //     pass: process.env.EMAIL_PASS  // ✅ now will work
    //   }
    // });

//     const transporter = nodemailer.createTransport({
//   host: "smtp.gmail.com",
//   port: 587,
//   secure: false, // TLS
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS
//   },
//   tls: {
//     rejectUnauthorized: false
//   },
//   family: 4
// });

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: {
    rejectUnauthorized: false
  },
  lookup: (hostname, options, callback) => {
    return dns.lookup(hostname, { family: 4 }, callback); // 🔥 FORCE IPv4
  }
});


    const info = await transporter.sendMail({
      // ✅ UPDATED: Add branding name (IMPORTANT)
      from: `"Trackiva" <${process.env.EMAIL_USER}>`, // 🔥 shows Trackiva instead of raw email

      to,
      subject,
      html
    });

    console.log("✅ Email sent:", info.response);

  } catch (error) {

    console.log("❌ Email error:", error.message);

  }

};

module.exports = sendEmail;