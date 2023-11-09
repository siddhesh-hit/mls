const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const otpEmailGenerator = async (email, otp) => {
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
      subject: "OTP for email verification",
      text: `Your OTP for email verification is ${otp}`,
    };

    const info = await transporter.sendMail(mailOptions);
    return info;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = otpEmailGenerator;
