const nodemailer = require('nodemailer');

// Configuration pour Gmail (vous pouvez utiliser d'autres services de messagerie)
// const transporter = nodemailer.createTransport({
//   host: 'smtp.mailtrap.io',
//   port: 2525,
//   auth: {
//     user: '223bb55838e7a9',
//     pass: '9305bb80677c25',
//   },
// });

// const transporter = nodemailer.createTransport({
//   host: 'mail.monassoci.com', // Remplacez par le serveur SMTP de votre fournisseur
//   port: 587, // Remplacez par le port SMTP de votre fournisseur
//   auth: {
//     user: 'admin@monassoci.com', // Remplacez par votre adresse e-mail professionnelle
//     pass: 'Monasso@2022', // Remplacez par votre mot de passe e-mail
//   },
//   requireTLS: true,
//   //secure: true, // Si vous utilisez SSL/TLS, réglez sur true
// });

// MAIL_MAILER=smtp
// MAIL_HOST=mail.monassoci.com
// MAIL_PORT=465
// MAIL_USERNAME=admin@monassoci.com
// MAIL_PASSWORD=Monasso@2022
// MAIL_ENCRYPTION=ssl
// MAIL_FROM_ADDRESS=admin@monassoci.com
// MAIL_FROM_NAME="Mon Asso"

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


const transporter = nodemailer.createTransport({
  host: 's552.usw8.mysecurecloudhost.com',
  port: 587,
  secure: false,
  auth: {
    user: 'yasmine@monassoci.com',
    pass: 'Yasmine@2023',
  },
  requireTLS: true,
  tls: {
    rejectUnauthorized: false,
  },
});

// Fonction pour envoyer un e-mail
function sendEmail(destinataire, sujet, contenu, callback) {
  const mailOptions = {
    from: 'yasmine@monassoci.com', // Votre adresse e-mail
    to: destinataire, 
    subject: sujet,
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
