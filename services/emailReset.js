const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const sendEmail = async (email) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME,
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "Reset Password Link",
      text: `Your reset password link is valid for 10 minutes only and can be used only once. If you did not request a password reset, please ignore this email. Otherwise, please visit the following link to reset your password: ${process.env.CLIENT_URL}/resetPassword`,
    };

    const info = await transporter.sendMail(mailOptions);

    return info;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = sendEmail;
