const nodemailer = require("nodemailer");

const SendMail = async (email, subject, link) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: Number(process.env.EMAIL_PORT),
      secure: Boolean(process.env.SECURE),
      auth: {
        user: process.env.SENDER,
        pass: process.env.PASSWORD,
      },
    });

    await transporter.sendMail({
      from: process.env.SENDER,
      to: email,
      subject: subject,
      html: `<a href="${link}">Click here to reset password</a>`,
    });

    console.log("Email sent successfully");
  } catch (error) {
    console.error("Email not sent:", error);
  }
};

module.exports = { SendMail };
