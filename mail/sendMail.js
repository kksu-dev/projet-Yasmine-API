const nodemailer = require('nodemailer');

// Configuration pour Gmail (vous pouvez utiliser d'autres services de messagerie)
const transporter = nodemailer.createTransport({
  host: 'smtp.mailtrap.io',
  port: 2525,
  auth: {
    user: '223bb55838e7a9',
    pass: '9305bb80677c25',
  },
});

// Configuration pour un serveur SMTP personnalisé (par exemple, pour Outlook)
/* const transporter = nodemailer.createTransport({
  host: 'smtp.example.com',
  port: 587,
  secure: false,
  auth: {
    user: 'votre_email@example.com',
    pass: 'votre_mot_de_passe',
  },
}); */

// Fonction pour envoyer un e-mail
function sendEmail(destinataire, sujet, contenu, callback) {
  const mailOptions = {
    from: 'koffisergeulrich@gmail.com', // Votre adresse e-mail
    to: destinataire, // Adresse e-mail du destinataire
    subject: sujet,
    // text: contenu,
    // html: '<p>Contenu du message au format HTML</p>', // Si vous souhaitez envoyer un e-mail HTML
    html: contenu,

  };

  // Envoi de l'e-mail
  transporter.sendMail(mailOptions, callback);
}

// Exemple d'utilisation de la fonction sendEmail
// sendEmail(
//   'koffisergeulrich@gmail.com',
//   'Sujet de l\'e-mail',
//   'Contenu du message texte',
//   (error, info) => {
//     if (error) {
//       console.log('Erreur lors de l\'envoi de l\'e-mail :', error);
//     } else {
//       console.log('E-mail envoyé avec succès :', info.response);
//     }
//   }
// );

// Exportez la fonction sendEmail pour pouvoir l'utiliser dans d'autres fichiers
module.exports = sendEmail;
