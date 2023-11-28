const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

const inviteEmail = async (email, password) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      secure: true,
      auth: {
        user: process.env.EMAIL_USERNAME || "",
        pass: process.env.EMAIL_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USERNAME,
      to: email,
      subject: "User Invitation from Admin",
      text: `You are invited to join the app. These are your login credentials: ${email} and password: ${password}
        Please login and change your password. Also make sure to update your profile.
        Thank you.`,
    };

    const info = await transporter.sendMail(mailOptions);

    return info;
  } catch (error) {
    throw new Error(error.message);
  }
};

module.exports = inviteEmail;
