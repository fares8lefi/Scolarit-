const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

exports.sendTimetableUpdateNotification = async (emails, entryInfo, action = "mis à jour") => {
  try {
    const { className, subjectName, dayOfWeek, startTime, endTime } = entryInfo;
    
    // Pour des raisons d'efficacité, on peut envoyer en Bcc (blind carbon copy) si bcp d'users
    // Mais ici on va peut-être faire un envoi groupé simple ou boucler
    // Nodemailer supporte une liste d'emails séparés par des virgules
    
    const actionTitle = action === "supprimé" ? "Suppression d'un cours" : "Mise à jour de l'Emploi du Temps";

    const mailOptions = {
      from: process.env.EMAIL_USER,
      bcc: emails,
      subject: `${actionTitle} - Scolarité App`,
      text: `Bonjour,\n\nUn cours a été ${action}.\n\nDétails :\nClasse : ${className}\nMatière : ${subjectName}\nJour : ${dayOfWeek}\nHoraires : ${startTime} - ${endTime}\n\nMerci de consulter la plateforme pour plus de détails.`,
      html: `
        <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-top: 5px solid #4a90e2;">
          <h2 style="color: #4a90e2;">${actionTitle}</h2>
          <p>Bonjour,</p>
          <p>Un cours dans l'emploi du temps a été <strong>${action}</strong> avec les détails suivants :</p>
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Classe :</strong> ${className}</p>
            <p><strong>Matière :</strong> ${subjectName}</p>
            <p><strong>Jour :</strong> ${dayOfWeek}</p>
            <p><strong>Horaires :</strong> ${startTime} - ${endTime}</p>
          </div>
          <p>Merci de vous connecter à la plateforme pour consulter l'intégralité de votre emploi du temps.</p>
          <p style="font-size: 0.8em; color: #777; margin-top: 30px; border-top: 1px solid #eee; padding-top: 10px;">
            Ceci est un message automatique, merci de ne pas y répondre.
          </p>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log(`[DEBUG] Timetable update notification sent to ${emails.length} users.`);
  } catch (error) {
    console.error("Error sending timetable update notification:", error);
    
  }
};
