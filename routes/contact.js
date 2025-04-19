const express = require("express");
const nodemailer = require("nodemailer");
const router = express.Router();
require("dotenv").config(); // Load .env file

// POST /api/contact
router.post("/", async (req, res) => {
  const { name, email, message, phone } = req.body;

  if (!name || !email || !message || !phone) {
    return res.status(400).json({ error: "Please fill all fields" });
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT) || 465,
      secure: true, // SSL
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: `"${name}" <${process.env.EMAIL_USER}>`, // Use your domain email as sender
      to: process.env.RECEIVER_EMAIL,
      subject: `Contact Enquiry from ${name}`,
      html: `
        <h2>New Contact Request</h2>
        <p><strong>Name:</strong> ${name}</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Phone:</strong> ${phone}</p>
        <p><strong>Message:</strong><br>${message}</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Message sent:", info.messageId);

    res.status(200).json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending email:", error);
    res.status(500).json({ success: false, error: "Email could not be sent" });
  }
});

module.exports = router;
