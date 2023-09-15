require('dotenv').config();

module.exports = {
  clientId: process.env.ORANGE_CLIENT_ID,
  clientSecret: process.env.ORANGE_CLIENT_SECRET,
  senderPhone: 'tel:+22507573476938', // Remplacez par votre numéro Orange
};