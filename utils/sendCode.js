require("dotenv").config();
const nodemalir = require("nodemailer");

const sendCode = (payload) => {
  // logic to send email with reset code
  const transporter = nodemalir.createTransport({
    service: "gmail",
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: true,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.SMTP_USER,
    to: payload.email,
    subject: "Password Reset Code",
    text: `Your password reset code is: ${payload.resetCode}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
    } else {
      console.log("Email sent:", info.response);
    }
  });
};

module.exports = sendCode;
