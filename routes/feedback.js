const express = require('express')
const nodemailer = require('nodemailer');
const router = express.Router();
require("dotenv").config(); // Load .env file

router.post("/", async(req, res)=>{
    if (req.method === 'POST') {
        const { name, email, feedback } = req.body;

        if (!feedback) {
            return res.status(400).json({ error: 'Feedback cannot be empty.' });
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
                subject: `New Website Feedback`,
                html: `
                    <h3>New Feedback Received</h3>
                    ${name ? `<p><strong>Name:</strong> ${name}</p>` : ''}
                    ${email ? `<p><strong>Email:</strong> ${email}</p>` : ''}
                    <p><strong>Feedback:</strong></p>
                    <p>${feedback}</p>
                `,
            };

            const info = await transporter.sendMail(mailOptions);
            console.log("Feedback email sent:", info.messageId);

            return res.status(200).json({ message: 'Feedback submitted successfully!' });
        } catch (error) {
            console.error('Error sending feedback email:', error);
            return res.status(500).json({ error: 'Failed to send feedback.' });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        return res.status(405).end(`Method ${req.method} Not Allowed`);
    }
})

module.exports = router