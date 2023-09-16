// // const axios = require('axios');

// // // Remplacez ces valeurs par vos propres clés d'API
// // const clientId = 'juBous5MOxSOLu9Ka97sTBmycObhjKlC';
// // const clientSecret = '8jUHGiC1mUelw0Lg';

// // // Obtenez un jeton d'accès OAuth2
// // async function getAccessToken() {
// //   try {
// //     const response = await axios.post('https://api.orange.com/oauth/v3/token', null, {
// //       params: {
// //         grant_type: 'client_credentials',
// //       },
// //       auth: {
// //         username: clientId,
// //         password: clientSecret,
// //       },
// //     });
// //     return response.data.access_token;
// //   } catch (error) {
// //     console.error('Erreur lors de l\'obtention du jeton d\'accès:', error);
// //     throw error;
// //   }
// // }
// // async function sendSMS(recipient, message) {
// //     const accessToken = await getAccessToken();
  
// //     const smsData = {
// //       outboundSMSMessageRequest: {
// //         address: `tel:${recipient}`,
// //         outboundSMSTextMessage: {
// //           message: message,
// //         },
// //       },
// //     };
  
// //     try {
// //       const response = await axios.post('https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B' + recipient + '/requests', smsData, {
// //         headers: {
// //           'Authorization': `Bearer ${accessToken}`,
// //           'Content-Type': 'application/json',
// //         },
// //       });
  
// //       console.log('SMS envoyé avec succès:', response.data);
// //     } catch (error) {
// //       console.error('Erreur lors de l\'envoi du SMS:', error);
// //     }
// //   }
  
// //   // Exemple d'utilisation
// //   sendSMS('+2250757347693', 'Bonjour, voici votre SMS de test depuis Node.js.');
  
// // // Fonction pour envoyer un SMS

// const axios = require('axios');

// // Remplacez ces valeurs par vos propres clés d'API
// const clientId = 'juBous5MOxSOLu9Ka97sTBmycObhjKlC';
// const clientSecret = '8jUHGiC1mUelw0Lg';

// // Obtenez un jeton d'accès OAuth2
// async function getAccessToken() {
//   try {
//     const response = await axios.post('https://api.orange.com/oauth/v3/token', null, {
//       params: {
//         grant_type: 'client_credentials',
//       },
//       auth: {
//         username: clientId,
//         password: clientSecret,
//       },
//     });
//     return response.data.access_token;
//   } catch (error) {
//     console.error('Erreur lors de l\'obtention du jeton d\'accès:', error);
//     throw error;
//   }
// }

// // Fonction pour envoyer un SMS
// async function sendSMS(recipient, message) {
//   const accessToken = await getAccessToken();

//   const smsData = {
//     outboundSMSMessageRequest: {
//       address: `tel:${recipient}`,
//       outboundSMSTextMessage: {
//         message: message,
//       },
//     },
//   };

//   try {
//     const response = await axios.post(`https://api.orange.com/smsmessaging/v1/outbound/tel%3A%2B${recipient}/requests`, smsData, {
//       headers: {
//         'Authorization': `Bearer ${accessToken}`,
//         'Content-Type': 'application/json',
//       },
//     });

//     console.log('SMS envoyé avec succès:', response.data);
//   } catch (error) {
//     console.error('Erreur lors de l\'envoi du SMS:', error);
//   }
// }

// // Exemple d'utilisation
// sendSMS('+2250757347693', 'Bonjour, voici votre SMS de test depuis Node.js.');


const axios = require('axios');
const dotenv = require('dotenv');
dotenv.config(); // Charge les variables d'environnement depuis .env

// Informations d'identification
const CLIENT_ID = process.env.ORANGE_CLIENT_ID;
const CLIENT_SECRET = process.env.ORANGE_CLIENT_SECRET;

// URL de l'API Orange
const API_URL = 'https://api.orange.com/oauth/v3/token';

// Données de demande OAuth2
const authData = {
  grant_type: 'client_credentials',
  client_id: 'juBous5MOxSOLu9Ka97sTBmycObhjKlC',
  client_secret: '8jUHGiC1mUelw0Lg',
};

// Fonction pour obtenir un jeton OAuth2
async function getAuthToken() {
  try {
   
    const response = await axios.post(API_URL, null, {
      params: authData,
    });

    const { access_token } = response.data;

    return access_token;
  } catch (error) {
    console.error('Erreur lors de l\'obtention du jeton OAuth2 :', error);
    throw error;
  }
}
// getAuthToken()
// Fonction pour envoyer un SMS
async function sendSMS(recipient, message) {
    const authToken = await getAuthToken();
  
    const smsData = {
      outboundSMSMessageRequest: {
        address: [recipient],
        senderAddress: '+2250757347693',
        outboundSMSTextMessage: {
          message: message,
        },
      },
    };
  
    const headers = {
      'Authorization': 'Basic anVCb3VzNU1PeFNPTHU5S2E5N3NUQm15Y09iaGpLbEM6OGpVSEdpQzFtVWVsdzBMZw==',
      'Content-Type': 'application/json',
    };
  
    try {
      const response = await axios.post('https://api.orange.com/smsmessaging/v1/outbound/tel:+2250757347693/requests', smsData, {
        headers: headers,
      });
  
      console.log('SMS envoyé avec succès !');
    } catch (error) {
      console.error('Erreur lors de l\'envoi du SMS :', error);
    }
  }
  
  // Appel de la fonction pour envoyer un SMS
//   sendSMS('+2250757347693', 'Votre_Message_SMS');
