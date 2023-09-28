
// const Utilisateur = require('../models/Utilisateur');
const bcrypt = require('bcrypt');
const { Utilisateur,Otp,TypeUtilisateur } = require('../models');
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

//Recuperer l'ensemble des utilisateurs
const getAllUser = async (req,res) => {
  try {
    // const users = await Utilisateur.findAll(); // Récupérez tous les utilisateurs de la base de données
    const users = await Utilisateur.findAll({
      include: [TypeUtilisateur], // Effectuez une jointure avec la table TypeUser
    });

    res.status(200).json({success:true, data:users});
  } catch (error) {
    console.error('Erreur lors de la récupération des utilisateurs :', error);
    res.status(500).json({ success:false,message: 'Une erreur est survenue lors de la récupération des utilisateurs.' });
  }
}

const verifExistUser = async (req,res) => {
  try {
    const email = req.body.email;
    const telephone = req.body.telephone;
    const existingUser = await Utilisateur.findOne({ where: { email } });
    const numberUser = await Utilisateur.findOne({ where: { telephone } });
            if (existingUser) {
              return res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
            }else if (numberUser) {
                return res.status(400).json({ message: 'Ce numero de telephone existe déjà.' }); 
            }else{
              return res.status(400).json({ message: 'ok' }); 
            }
  } catch (error) {
    
  }
}

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
            // const email = req.body.email;
            // const telephone = req.body.telephone;

            // const existingUser = await Utilisateur.findOne({ where: { email } });
            // const numberUser = await Utilisateur.findOne({ where: { telephone } });
            // if (existingUser) {
            //   return res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
            // }else if (numberUser) {
            //     return res.status(400).json({ message: 'Ce numero de telephone existe déjà.' }); 
            // }

        
            // Hacher le mot de passe
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
            // Créer un nouvel utilisateur
            const newUser = await Utilisateur.create({
              nom:req.body.nom,
              prenom:req.body.prenom,
              email:req.body.email,
              password: hashedPassword,
              // address:req.body.address,
              telephone:req.body.telephone,
              image : base64Image,
              typeUserId:req.body.typeUserId,
              dateNaissance:req.body.dateNaissance,
              genre:req.body.genre,
              ville:req.body.ville,
              isConnect:false,
              isValid:true
            });

            
              
              const message = 'Un e-mail de confiramtion a été envoyé.';
              const succes = 'L\'utilisateur à bien été enregistré';
              const otpResult = await generateOtp();
              sendEmail(
                email,
                'Confirmation de compte',
                '\<p>Cher utilisateur,</p><p>Merci de vous être inscrit sur notre plateforme. Pour confirmer votre compte, veuillez utiliser le code OTP ci-dessous :</p>\
                    <p>Code OTP : <span style="color:red">'+otpResult+'</span></p>\
                    <p>Ce code OTP est valide pour une seule utilisation et expirera dans 2min.</p><p>Assurez-vous de l\'utiliser rapidement.Si vous n\'avez pas demandé de compte sur YasmineApp, veuillez ignorer cet e-mail.</p>\
                    <p>Cordialement,</p>',
              (error, info) => {
                if (error) {
                  console.log('Erreur lors de l\'envoi de l\'e-mail :', error);
                } else {
                  console.log('E-mail envoyé avec succès :', info.response);
                }
              }
              );
              return res.status(201).json({success:succes, message: message});

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



const generateResetToken = (req,res) =>{
  // Génère un jeton aléatoire de 32 octets (256 bits)
  const token = crypto.randomBytes(32).toString('hex');
  return token;
}


//Mot de passe oublié
const restPassword = async (req,res) => {
  const { email } = req.body;

  // Recherchez l'utilisateur par son adresse e-mail dans la base de données
  const user = await Utilisateur.findOne({ where: { email } });
  if (!user) {
    return res.status(404).json({ success:false,message: 'Utilisateur non trouvé.' });
  }

//   // Générer un token de réinitialisation de mot de passe
  const resetToken = await generateResetToken();
  const resetOtp = await generateOtp();
  user.resetToken= resetToken;
  await user.save();
  // sendResetPasswordEmail(user.email, resetToken); 
  sendEmail(
    user.email,
    'Réinitialisation de mot de passe',
    '\<h1>Vous avez demandé une réinitialisation de mot de passe.</h1>\
    <p>Bonjour '+user.email+',</p><p>Nous avons reçu votre demande de code à usage\
    unique.</p><p>Votre code à usage unique est : <span style="color:red">'+resetOtp+'</span></p>\
    <p>Si vous n’avez demandé aucun code, vous pouvez ignorer cet e-mail.</p><p> Un autre utilisateur a\
    peut-être indiqué votre adresse e-mail par erreur.</p><p>Merci,L’équipe des comptes de yasmineApp\</p>',
    (error, info) => {
      if (error) {
        console.log('Erreur lors de l\'envoi de l\'e-mail :', error);
      } else {
        console.log('E-mail envoyé avec succès :', info.response);
      }
    }
  );
  res.status(200).json({ success:true,message: 'Un e-mail de réinitialisation de mot de passe a été envoyé.',data:resetToken });
} 

const verificationOtp = async (req,res) => {
  const { otp,resetToken } = req.body;
  // Vérification du token dans la table "user"
  Utilisateur.findOne({ where: { resetToken } })
    .then(Utilisateur => {
      if (!Utilisateur) {
        // Le token n'existe pas dans la table "user"
        res.status(401).json({success: false,message:"Token invalide"});
      } else {
        // Vérification de l'otp dans la table "Otp"
        Otp.findOne({ where: { otp } })
          .then(Otp => {
            if (!Otp) {
              // L'otp n'existe pas dans la table "Otp"
              res.status(401).json({success: false,message:"OTP invalide"});
            } else {
              // Vérification de la date d'expiration de l'OTP
              const currentDate = new Date();
              //const otpExpiration = new Date(top.expires_at); 

            // Vérifiez si l'OTP a expiré dans les 2 minutes suivant sa création
              const expirationOtp = new Date(Otp.expires_at);
              expirationOtp.setMinutes(expirationOtp.getMinutes() + 2);
              if (expirationOtp < currentDate) {
                // L'OTP a expiré
                res.status(401).json({success: false,message:"OTP expiré"});
              } else {
                // Les deux vérifications ont réussi, vous pouvez continuer avec votre logique de traitement.
                Otp.destroy();
                res.status(200).json({success: true,message:"Vérification réussie"});
              }
            }
          })
          .catch(error => {
            console.error(error);
            res.status(500).json({success: false,message:"Erreur serveur"});
          });
      }
    })
    .catch(error => {
      console.error(error);
      res.status(500).json({success: false,message:"Erreur serveur"});
    });
} 

const changePassword = async (req,res) => {
  const {resetToken,newPassword} = req.body;
  // Recherchez l'utilisateur par son adresse e-mail dans la base de données
  const user = await Utilisateur.findOne({ where: { resetToken } });
  // console.log(user);
  if (!user) {
    return res.status(404).json({ success: false,message: 'Token non valide.' });
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);
  console.log(hashedPassword);
  user.password = hashedPassword;
  user.resetToken = null;
  user.save();

  res.status(200).json({ success: true,message: 'Votre mot de passe à été réinitialisé.' });
}



const validOtpUser = async (req,res) => {
    try {
        // Find the OTP record in the database by the OTP value
        const otpToVerify = req.body.otp;
        const otpRecord = await Otp.findOne({ where: { otp: otpToVerify } });
        const otpValid = false;
        // If no OTP record is found or it has expired
        if (!otpRecord || otpRecord.expires_at < new Date()) {
          
            res.status(200).json({ success:false,message:'Otp invalides' }); // The OTP is invalid or expired
            
        }
        
        await otpRecord.destroy();
        
        return res.status(200).json({  success:true,message:'Otp valide'}); // The OTP is invalid or expired
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
    utilisateur.isConnect = true;
    utilisateur.save();
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


const testmail = async (req,res) => {
  
      // Envoyez le SMS de bienvenue à l'utilisateur
      sendEmail(
        'koffisergeulrich@gmail.com',
        'otp',
        '\
        <h1>Titre de l\'e-mail</h1>\
        <p>Contenu du message au format HTML</p>\
        <div style="color:red">je suis bien ainsi</div>',
      (error, info) => {
        if (error) {
          console.log('Erreur lors de l\'envoi de l\'e-mail :', error);
        } else {
          console.log('E-mail envoyé avec succès :', info.response);
        }
      }
      );
   
}

const test = async (req,res) => {
  
      // Envoyez le SMS de bienvenue à l'utilisateur
     res.json({ok:"bonjour"});
   
}

const deleteUser = async (req,res) => {

  const { UtilisateurId } = req.body;

  // Recherchez l'utilisateur par son nom d'utilisateur
  const utilisateur = await Utilisateur.findOne({ where: { UtilisateurId } });
  // return res.json({message:utilisateur.nom}) ;
  if (!utilisateur) {
    return res.status(401).json({ message: 'Cet utilisateur n\'existe pas' });
  }
  utilisateur.isValid = false;
  utilisateur.save();
  res.json({success:true,message: 'l\'utilisateur à été retiré.'});
}

const activeUser = async (req,res) => {

  const { UtilisateurId } = req.body;

  // Recherchez l'utilisateur par son nom d'utilisateur
  const utilisateur = await Utilisateur.findOne({ where: { UtilisateurId } });
  // return res.json({message:utilisateur.nom}) ;
  if (!utilisateur) {
    return res.status(401).json({ message: 'Cet utilisateur n\'existe pas' });
  }
  utilisateur.isValid = true;
  utilisateur.save();
  res.json({success:true,message: 'l\'utilisateur à été retiré.'});
}


module.exports = {
  registerUser,
  connexionUser,
  validOtpUser,
  generateOtp,
  testSms,
  testmail,
  restPassword,
  verificationOtp,
  changePassword,
  getAllUser,
  deleteUser,
  activeUser,
  verifExistUser,
  test
};
