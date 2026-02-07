const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER, // your@gmail.com
    pass: process.env.EMAIL_PASS  // app password
  }
});

exports.sendEmail = async ({ to, subject, html }) => {
  await transporter.sendMail({
    from: `"Dental Suite" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html
  });
};
