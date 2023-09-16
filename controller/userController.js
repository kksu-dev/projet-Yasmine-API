
// const Utilisateur = require('../models/Utilisateur');
const bcrypt = require('bcrypt');
const { Utilisateur,Otp } = require('../models');
// const { sendEmail } = require('../mail/sendMail');
const sendEmail = require('../mail/sendMail');

const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');
const jwt = require('jsonwebtoken');
require('dotenv');

const crypto = require('crypto');



// const { sendSMS } = require('../sms/senderSms');
const { sendSMS } = require('../sms/sendSms');

// Fonction pour créer un nouvel utilisateur
const Storage = multer.diskStorage(
    {
      destination:'clients',
      filename:(req,file,cb)=>{
        cb(null,file.originalname)
        // cb(null,Date.now() + "-" +'user')
        
      }
    }
  );
  
const upload = multer({ storage:Storage,limits: { fileSize: 50 * 1024 * 1024 }, }).single('imageClient');
const registerUser = async (req, res, next) => {
    upload(req, res, async (err) => {
        if (err) {
            if (err.code === 'LIMIT_FILE_SIZE') {
                // Gérer l'erreur de taille de fichier
                return res.status(400).json({ message: 'Le fichier est trop volumineux. La taille maximale autorisée est de 5 Mo.' });
              } else {
                // Gérer d'autres erreurs d'upload
                return res.status(500).json({ message: 'Erreur lors de l\'upload du fichier.' });
              }
        }
        const imageBuffer = fs.readFileSync(req.file.path);
        // const base64Image = imageBuffer.toString('base64');
       

        // fs.unlinkSync(req.file.path);
        try {
            const resizedImageBuffer = await sharp(imageBuffer)
            .resize({ width: 100, height: 100 }) // Redimensionnement de l'image
            .toBuffer();
            const base64Image = resizedImageBuffer.toString('base64');
            // const { nom,prenom,email, password,address,telephone,typeUserId,imageClient } = req.body;
        
            // Vérifier si l'utilisateur existe déjà
            const email = req.body.email;
            const telephone = req.body.telephone;

            const existingUser = await Utilisateur.findOne({ where: { email } });
            const numberUser = await Utilisateur.findOne({ where: { telephone } });
            if (existingUser) {
              return res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
            }else if (numberUser) {
                return res.status(400).json({ message: 'Ce numero de telephone existe déjà.' }); 
            }

        
            // Hacher le mot de passe
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
            // Créer un nouvel utilisateur
            const newUser = await Utilisateur.create({
              nom:req.body.nom,
              prenom:req.body.prenom,
              email:req.body.email,
              password: hashedPassword,
              address:req.body.address,
              telephone:req.body.telephone,
              image : base64Image,
              typeUserId:req.body.typeUserId,
              dateNaissance:req.body.dateNaissance,
              genre:req.body.genre,
            });

            
              
              const message = 'Vous avez reçu un Otp.';
              const otpResult = await generateOtp();
              sendEmail(
                'koffisergeulrich@gmail.com',
                'otp',
                '\
                <h1>Confirmation de votre mail</h1>\
                <p>'+otpResult+'</p>\
                <div style="color:red">je suis bien ainsi</div>',
              (error, info) => {
                if (error) {
                  console.log('Erreur lors de l\'envoi de l\'e-mail :', error);
                } else {
                  console.log('E-mail envoyé avec succès :', info.response);
                }
              }
              );
              return res.status(201).json({message: message, data: newUser});

          } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                // Si une erreur de validation Sequelize se produit, renvoyez une réponse avec le statut 400 (Bad Request) et les messages d'erreur
                const validationErrors = error.errors.map(err => err.message);
                res.status(400).json({ errors: validationErrors });
              } else {
                // Si une autre erreur se produit, renvoyez une réponse avec le statut 500 (Internal Server Error) et un message d'erreur générique
                res.status(500).json({ error: 'Une erreur est survenue lors de la création de l\'utilisateur.' });
              }
            // console.error(error);
            // return res.status(500).json({ message: 'Une erreur est survenue lors de l\'inscription.' });
          }finally {
            // Supprimer le fichier original
            // fs.unlinkSync(req.file.path);
          }
    });
  
};

const validOtpUser = async (req,res) => {
    try {
        // Find the OTP record in the database by the OTP value
        const otpToVerify = req.body.otp;
        const otpRecord = await Otp.findOne({ where: { otp: otpToVerify } });
    
        // If no OTP record is found or it has expired
        if (!otpRecord || otpRecord.expires_at < new Date()) {
            res.status(200).json({ message:'Otp invalides',data: false }); // The OTP is invalid or expired
        }
    
        // You can also include additional logic here, such as marking the OTP as used
    
        return res.status(200).json({ message:'Otp valide',data: true}); // The OTP is invalid or expired
        ; // The OTP is valid and not expired
      } catch (error) {
        console.error('Error verifying OTP:', error);
        return false; // An error occurred during verification
      }
};

//connecter un utilisateur
const connexionUser = async (req,res) => {

    const { telephone, password } = req.body;
  
    // Recherchez l'utilisateur par son nom d'utilisateur
    const utilisateur = await Utilisateur.findOne({ where: { telephone } });
    // return res.json({message:utilisateur.nom}) ;
    if (!utilisateur || !bcrypt.compareSync(password, utilisateur.password)) {
      return res.status(401).json({ message: 'Nom d\'utilisateur ou mot de passe incorrect' });
    }
  
    // Générez un token JWT
    const token = jwt.sign({ utilisateur }, process.env.JWT_SECRET , { expiresIn: '24h' });
    // const jwtSecret = crypto.randomBytes(32).toString('hex');
    res.json({token:token});
}


//construire mon otp
const generateNumericOtp = (length) => {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        otp += digits[randomIndex];
    }
    return otp;
};

//generer l'otp
const generateOtp = async (req,res) => {
    try {
        // Generate a 6-digit numeric OTP
        const otp = generateNumericOtp(6);
        const expirationDate = new Date();
        expirationDate.setMinutes(expirationDate.getMinutes() + 2);
        const newOtp = await Otp.create({
            otp: otp,
            expires_at: expirationDate,
        });
        return otp;
        // return res.status(200).json({ message:'Otp cree avec succes',data: newOtp });
    } catch (error) {
        console.error('Error generating OTP:', error);
        return res.status(500).json({ message: 'Error generating OTP' });
    }
}

const testSms = async (req,res) => {
    try {
        // Envoyez le SMS de bienvenue à l'utilisateur
        await main();
        console.log('SMS envoyé avec succès');
      } catch (error) {
        console.error('Erreur lors de l\'envoi du SMS :', error);
      }
}

// const testmail = async (req,res) => {
  
//       // Envoyez le SMS de bienvenue à l'utilisateur
//       sendEmail(
//         'koffisergeulrich@gmail.com',
//         'otp',
//         '\
//         <h1>Titre de l\'e-mail</h1>\
//         <p>Contenu du message au format HTML</p>\
//         <div style="color:red">je suis bien ainsi</div>',
//       (error, info) => {
//         if (error) {
//           console.log('Erreur lors de l\'envoi de l\'e-mail :', error);
//         } else {
//           console.log('E-mail envoyé avec succès :', info.response);
//         }
//       }
//       );
   
// }
module.exports = {
  registerUser,
  connexionUser,
  validOtpUser,
  generateOtp,
  testSms,
  // testmail
};
