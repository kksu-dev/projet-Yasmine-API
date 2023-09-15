
// const Utilisateur = require('../models/Utilisateur');
const bcrypt = require('bcrypt');
const { Utilisateur,Otp } = require('../models');
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');
// const { sendSMS } = require('../sms/senderSms');
const { sendSMS } = require('../sms/senderSms');

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
        
            // return res.status(201).json(newUser);
            // const confirmationMessage = 'Utilisateur créé avec succès.';
            const message = 'Vous avez reçu un Otp.';
            const otpResult = await generateOtp(req, res);
                // Envoyez le SMS de bienvenue à l'utilisateur
            // await sendSMS('+2250757347693', message);
            // try {
            //     // Envoyez le SMS de bienvenue à l'utilisateur
            //     await sendSMS('+2250757347693', message);
            //     console.log('SMS envoyé avec succès');
            //   } catch (error) {
            //     console.error('Erreur lors de l\'envoi du SMS :', error);
            //   }
            //   return res.status(200).json({ message:'Otp cree avec succes',data: newOtp });

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





const generateNumericOtp = (length) => {
    const digits = '0123456789';
    let otp = '';
    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * digits.length);
        otp += digits[randomIndex];
    }
    return otp;
};

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
        // return res.status(200).json({ message:'Otp cree avec succes',data: newOtp });
    } catch (error) {
        console.error('Error generating OTP:', error);
        return res.status(500).json({ message: 'Error generating OTP' });
    }
}

const testSms = async (req,res) => {
    try {
        // Envoyez le SMS de bienvenue à l'utilisateur
        await sendSMS('+2250757347693', 'message');
        console.log('SMS envoyé avec succès');
      } catch (error) {
        console.error('Erreur lors de l\'envoi du SMS :', error);
      }
}
module.exports = {
  registerUser,
  validOtpUser,
  generateOtp,
  testSms
};
