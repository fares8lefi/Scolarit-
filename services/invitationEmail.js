const nodemailer = require("nodemailer");

exports.sendInvitationEmail = async (user, code) => {
  try {
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Code d'activation - Scolarité App",
      text: `Bonjour ${user.firstName},\n\nVous avez été invité à rejoindre la plateforme. Voici votre code d'activation : ${code}\n\nCe code est valable pendant 24 heures.`,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};