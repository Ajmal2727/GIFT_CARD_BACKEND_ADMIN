import nodemailer from "nodemailer";
import dotenv from "dotenv";
import { getForgotPasswordTemplate } from "../emailTemplate.js";
dotenv.config();

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

// ✅ Check SMTP Connection
transporter.verify((error, success) => {
    if (error) {
        console.error("❌ SMTP Connection Error:", error);
    } else {
        console.log("✅ SMTP Server is Ready to Send Emails!");
    }
});

const sendEmail = async (email, name, token) => {

    try {



        const resetLink = `${process.env.FRONTEND_LOCAL_URL}/reset-password/${token}`;
        const emailTemplate = getForgotPasswordTemplate(name, resetLink);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: "🔐 Forgot Your Password - BallysFather",
            html: emailTemplate,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`✅ Reset email sent to ${email}: ${info.messageId}`);
    } catch (error) {
        console.error("❌ Error sending reset email:", error);
    }
};


export { sendEmail };
