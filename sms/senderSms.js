// smsSender.js
const axios = require('axios');
const config = require('../config/configSms');

async function sendSMS(recipientPhone, message) {
  const authUrl = `https://api.orange.com/oauth/v3/token`;
//   const smsApiUrl = `https://api.orange.com/smsmessaging/v1/outbound/${config.senderPhone}/requests`;

  const smsApiUrl = `https://api.orange.com/smsmessaging/v1/outbound/tel:+2250757347693/requests`;
  

  const authData = {
    grant_type: 'client_credentials',
    client_id: config.clientId,
    client_secret: config.clientSecret,
  };

  try {
    // Obtenir un jeton d'accès OAuth 2.0
    const authResponse = await axios.post(authUrl, null, {
      params: authData,
    });

    const accessToken = authResponse.data.access_token;

    // Envoyer le SMS
    const smsData = {
      outboundSMSMessageRequest: {
        address: recipientPhone,
        senderAddress: config.senderPhone,
        outboundSMSTextMessage: {
          message,
        },
      },
    };

    const headers = {
      'Authorization': `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    };

    const smsResponse = await axios.post(smsApiUrl, smsData, {
      headers,
    });

    return smsResponse.data;
  } catch (error) {
    throw error;
  }
}

module.exports = {
  sendSMS,
};
