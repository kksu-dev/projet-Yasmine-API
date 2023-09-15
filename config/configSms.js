require('dotenv').config();

module.exports = {
  clientId: process.env.ORANGE_CLIENT_ID,
  clientSecret: process.env.ORANGE_CLIENT_SECRET,
  senderPhone: 'tel:+2250757347693', // Remplacez par votre numéro Orange
};