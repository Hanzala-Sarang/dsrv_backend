const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();

// POST /api/contact
router.post("/", async (req, res) => {
  const { name, email, message, phone } = req.body;

  if (!name || !email || !message || !phone) {
    return res.status(400).json({ error: "Please fill all fields" });
  }

  try {
    // Nodemailer transport setup for Hostinger
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || "smtp.hostinger.com", // Use environment variable or default
      port: 465, // Typically 465 for SSL
      secure: true, // Use SSL
      auth: {
        user: process.env.EMAIL_USER, // Your Hostinger email address
        pass: process.env.EMAIL_PASS, // Your Hostinger email password
      },
    });

    const mailOptions = {
      from: `"${name}" <${email}>`,
      to: process.env.RECEIVER_EMAIL, // Your receiving email address
      subject: `Contact Enquiry from ${name}`,
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent:", info.messageId);
    res.status(200).json({ success: true, message: "Message sent successfully" });

  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: "Email could not be sent" });
  }
});

module.exports = router;