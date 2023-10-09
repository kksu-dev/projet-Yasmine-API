const bcrypt = require('bcrypt');
const { Utilisateur, Otp, TypeUtilisateur } = require('../models');
const sendEmail = require('../mail/sendMail');
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv'); // Importer dotenv correctement

dotenv.config(); // Charger les variables d'environnement depuis le fichier .env

const crypto = require('crypto');

const Storage = multer.diskStorage({
  destination: 'clients',
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

//A afficher pour la mise a jour de l'utilisateur x

const getUserByIdForUpdate = async (req,res,next) => {
  try {
    const UtilisateurId = req.body.UtilisateurId
    const user = await Utilisateur.findByPk(UtilisateurId);
    if (!user) {
      return res.status(200).json({ status:false,message: "Aucun utilisateur trouvé"});
    }
    return res.status(200).json({ status:true,data: user});
  } catch (error) {
    const message='Une erreur est survenue lors de la récupération de l\'utilisateur par son ID';
    return res.status(200).json({ status:false,message:message,errors:error.message});
    throw new Error('Une erreur est survenue lors de la récupération de l\'utilisateur par son ID');
  }
}


const upload = multer({
  storage: Storage,
  limits: { fileSize: 50 * 1024 * 1024 },
}).single('imageClient');
const registerAdminUser = async (req, res, next) => {
  upload(req, res, async (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({
          status: false,
          message:
            'Le fichier est trop volumineux. La taille maximale autorisée est de 5 Mo.',
        });
      } else {
        return res.status(500).json({
          status: false,
          message: "Erreur lors de l'upload du fichier.",
        });
      }
    }

    const imageBuffer = fs.readFileSync(req.file.path);

    try {
      const utilisateurConnecteRole = req.user.typeUserId;
      const utilisateurConnecte = req.user.isConnect;

      if (!utilisateurConnecte) {
        return res
          .status(401)
          .json({ status: false, message: 'Vous devez être connecté pour enregistrer un produit.' });
      }

      const roleUser = await TypeUtilisateur.findOne({
        where: { typeUserId: utilisateurConnecteRole },
      });

      if (!roleUser || (roleUser.libelle !== 'Admin' && roleUser.libelle !== 'Super Admin')) {
        return res.status(403).json({
          status: false,
          message: 'Vous n\'avez pas les autorisations nécessaires pour enregistrer un produit.',
        });
      }

      const resizedImageBuffer = await sharp(imageBuffer)
        .resize({ width: 100, height: 100 })
        .toBuffer();
      const base64Image = resizedImageBuffer.toString('base64');

      const email = req.body.email;
      const telephone = req.body.telephone;

      const existingUser = await Utilisateur.findOne({ where: { email } });
      const numberUser = await Utilisateur.findOne({ where: { telephone } });

      if (existingUser) {
        return res.status(400).json({
          status: false,
          message: 'Cet utilisateur existe déjà.',
        });
      } else if (numberUser) {
        return res.status(400).json({
          status: false,
          message: 'Ce numéro de téléphone existe déjà.',
        });
      }

      const hashedPassword = await bcrypt.hash(req.body.password, 10);

      const newUser = await Utilisateur.create({
        nom: req.body.nom,
        prenom: req.body.prenom,
        email: req.body.email,
        password: hashedPassword,
        telephone: req.body.telephone,
        image: base64Image,
        typeUserId: req.body.typeUserId,
        dateNaissance: req.body.dateNaissance,
        genre: req.body.genre,
        ville: req.body.ville,
        isConnect: false,
        isValid: true,
        accountManager: req.user.nom,
      });

      if (newUser) {
        sendEmail(
          email,
          'Félicitations',
          `<p>Cher utilisateur,</p><p>Nous vous félicitons pour votre compte créé en tant que ${roleUser.libelle}.</p>\
                        <p>Votre mot de passe par défaut est : ${req.body.password}</p>\
                        <p>Cordialement,</p>\
                        <p>L'équipe Yasmine,</p>`,
          (error, info) => {
            if (error) {
              console.log('Erreur lors de l\'envoi de l\'e-mail :', error);
            } else {
              console.log('E-mail envoyé avec succès :', info.response);
            }
          }
        );
        const messageAdmin = "L'utilisateur a bien été enregistré";
        return res.status(201).json({ status: true, message: messageAdmin });
      }
    } catch (error) {
      if (error.name === 'SequelizeValidationError') {
        const validationErrors = error.errors.map(err => err.message);
        return res.status(400).json({ errors: validationErrors });
      } else {
        return res.status(500).json({ error: 'Une erreur est survenue lors de la création de l\'utilisateur.', errors: error.message });
      }
    } finally {
      // Supprimer le fichier original
      fs.unlinkSync(req.file.path);
    }
  });
};


const updateAdminUser = async (req,res)=>{

  upload(req, res, async (err) => {
      if (err) {
          if (err.code === 'LIMIT_FILE_SIZE') {
              // Gérer l'erreur de taille de fichier
              return res.status(400).json({status:false, message: 'Le fichier est trop volumineux. La taille maximale autorisée est de 5 Mo.' });
            } else {
              // Gérer d'autres erreurs d'upload
              return res.status(500).json({status:false, message: 'Erreur lors de l\'upload du fichier.' });
            }
      }
     

      try {
          const utilisateurConnecteRole = req.user.typeUserId;
          const utilisateurConnecte = req.user.isConnect;
          
          if (utilisateurConnecte==false) {
              return res.status(401).json({ status: false, message: 'Vous devez être connecté pour modifier un utilisateur.' });
          }
          const roleUser = await TypeUtilisateur.findOne({ where: { typeUserId: utilisateurConnecteRole } });
          if (!roleUser || (roleUser.libelle !== "Admin" && roleUser.libelle !== "Super Admin")) {
              return res.status(403).json({ status: false, message: 'Vous n\'avez pas les autorisations nécessaires pour modifier un utilisateur.' });
          }
          // const resizedImageBuffer = await sharp(imageBuffer)
          // .resize({ width: 100, height: 100 }) // Redimensionnement de l'image
          // .toBuffer();
          // const base64Image = resizedImageBuffer.toString('base64');

          let base64Image = null;
          if (req.file) {
              const imageBuffer = fs.readFileSync(req.file.path);
              const resizedImageBuffer = await sharp(imageBuffer)
                  .resize({ width: 100, height: 100 }) // Redimensionnement de l'image
                  .toBuffer();
              base64Image = resizedImageBuffer.toString('base64');
          }

          // const email = req.body.email;
          // const telephone = req.body.telephone;

          // const existingUser = await Utilisateur.findOne({ where: { email } });
          // const numberUser = await Utilisateur.findOne({ where: { telephone } });

          // if (existingUser) {
          //   return res.status(400).json({
          //     status: false,
          //     message: 'Cet utilisateur existe déjà.',
          //   });
          // } else if (numberUser) {
          //   return res.status(400).json({
          //     status: false,
          //     message: 'Ce numéro de téléphone existe déjà.',
          //   });
          // }
          

          const updateData = {
              nom: req.body.nom,
              prenom: req.body.prenom,
              email: req.body.email,
              // password: hashedPassword,
              telephone: req.body.telephone,
              // image: base64Image,
              typeUserId: req.body.typeUserId,
              dateNaissance: req.body.dateNaissance,
              genre: req.body.genre,
              ville: req.body.ville,
              // isConnect: false,
              // isValid: true,
          };
          // Si un nouveau fichier image a été sélectionné,on l'ajoutez au tableau 
          if (req.file) {
            updateData.image = base64Image;
          }
          if (req.body.password) {
            const hashedPassword = await bcrypt.hash(req.body.password, 10);
            updateData.password = hashedPassword
          }
          const [updatedRowsProduit] = await Utilisateur.update(
              updateData,
              { where: { UtilisateurId: req.body.UtilisateurId } }
          );      
            if (updatedRowsProduit > 0) {
              return res.status(200).json({ status: true, message: 'L\'utilisateur a été mis à jour avec succès.' });
            } else {
              return res.status(404).json({ status: false, message: 'Aucun utilisateur n\'a été trouvée pour la mise à jour.' });
            }   
      } catch (error) {
          if (error.name === 'SequelizeValidationError') {
              // Si une erreur de validation Sequelize se produit, renvoyez une réponse avec le statut 400 (Bad Request) et les messages d'erreur
              const validationErrors = error.errors.map(err => err.message);
              return res.status(400).json({ errors: validationErrors });
            } else {
              // Si une autre erreur se produit, renvoyez une réponse avec le statut 500 (Internal Server Error) et un message d'erreur générique
              return res.status(500).json({ errors: 'Une erreur est survenue lors de la modification de l\'utilisateur.',error: error.message });
            }
         
        }finally {
          // Supprimer le fichier original
          // fs.unlinkSync(req.file.path);
      }
  });
}

const deleteAdminUser = async (req, res) => {
  try {
      const utilisateurConnecteRole = req.user.typeUserId;
      const utilisateurConnecte = req.user.isConnect;
      
      if (utilisateurConnecte==false) {
          return res.status(401).json({ status: false, message: 'Vous devez être connecté pour supprimer un utilisateur.' });
      }
      const roleUser = await TypeUtilisateur.findOne({ where: { typeUserId: utilisateurConnecteRole } });
      if (!roleUser || (roleUser.libelle !== "Admin" && roleUser.libelle !== "Super Admin")) {
          return res.status(403).json({ status: false, message: 'Vous n\'avez pas les autorisations nécessaires pour supprimer un utilisateur.' });
      }

      const { UtilisateurIds } = req.body; 
  
      const result = await Utilisateur.destroy({
        where: {
          UtilisateurId: UtilisateurIds,
        },
      });
  
      if (result > 0) {
        return res.status(200).json({ status: true, message: 'Les utilisateurs ont été supprimés avec succès.' });
      } else {
        return res.status(404).json({ status: false, message: 'Aucun utilisateur n\'a été trouvé pour la suppression.' });
      }
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: 'Une erreur est survenue lors de la suppression des utilisateurs.', errors:error.message });
    }
};

const verifPassword = async (req, res) => {
  try {
      const utilisateurConnecteId = req.user.UtilisateurId;
      const utilisateurConnecte = req.user.isConnect;
      
      if (utilisateurConnecte==false) {
          return res.status(401).json({ status: false, message: 'Vous devez être connecté pour supprimer un utilisateur.' });
      }

      const {oldPassword} = req.body; 
  
      const user = await Utilisateur.findOne({ where: { UtilisateurId:utilisateurConnecteId } });

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur introuvable' });
      }

      if (!await bcrypt.compare(oldPassword, user.password)) {
        return res.status(401).json({status: false, message: 'Mot de passe actuel incorrect' });
      }
      return res.status(200).json({status: true, message: 'Mot de passe actuel correct' });

    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: 'Une erreur est survenue lors de la suppression des utilisateurs.', errors:error.message });
    }
};

//Pour modifier le mot de passe apres verification de l'ancien
const updatePassword = async (req, res) => {
  try {
      const utilisateurConnecteId = req.user.UtilisateurId;
      const utilisateurConnecte = req.user.isConnect;
      
      if (utilisateurConnecte==false) {
          return res.status(401).json({ status: false, message: 'Vous devez être connecté pour supprimer un utilisateur.' });
      }

      const {newPassword} = req.body; 
  
      const user = await Utilisateur.findOne({ where: { UtilisateurId:utilisateurConnecteId } });

      if (!user) {
        return res.status(404).json({ message: 'Utilisateur introuvable' });
      }

      // if (!await bcrypt.compare(oldPassword, user.password)) {
      //   return res.status(401).json({status: false, message: 'Mot de passe actuel incorrect' });
      // }

      //  nouveau mot de passe hachez
      const hashedPassword = await bcrypt.hash(newPassword, 10);

      user.password = hashedPassword;
      await user.save();

      return res.status(200).json({ status: true, message: 'Mot de passe modifié avec succès' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ status: false, message: 'Une erreur est survenue lors de la modification du mot de passe.', errors:error.message });
    }


   
};

module.exports = {
  getUserByIdForUpdate,
  registerAdminUser,
  updateAdminUser,
  deleteAdminUser,
  verifPassword,
  updatePassword
};




// const bcrypt = require('bcrypt');
// const { Utilisateur,Otp,TypeUtilisateur } = require('../models');
// // const { sendEmail } = require('../mail/sendMail');
// const sendEmail = require('../mail/sendMail');

// const multer = require('multer');
// const fs = require('fs');
// const sharp = require('sharp');
// const jwt = require('jsonwebtoken');
// require('dotenv');

// const crypto = require('crypto');


// // Fonction pour créer un nouvel utilisateur
// const Storage = multer.diskStorage(
//     {
//       destination:'clients',
//       filename:(req,file,cb)=>{
//         cb(null,file.originalname)
//         // cb(null,Date.now() + "-" +'user')
        
//       }
//     }
// );
  
// const upload = multer({ storage:Storage,limits: { fileSize: 50 * 1024 * 1024 }, }).single('imageClient');
// const registerAdminUser = async (req, res, next) => {
//     upload(req, res, async (err) => {
//         if (err) {
//             if (err.code === 'LIMIT_FILE_SIZE') {
//                 // Gérer l'erreur de taille de fichier
//                 return res.status(400).json({status:false, message: 'Le fichier est trop volumineux. La taille maximale autorisée est de 5 Mo.' });
//               } else {
//                 // Gérer d'autres erreurs d'upload
//                 return res.status(500).json({status:false, message: 'Erreur lors de l\'upload du fichier.' });
//               }
//         }
//         const imageBuffer = fs.readFileSync(req.file.path);
//         // const base64Image = imageBuffer.toString('base64');
       

//         // fs.unlinkSync(req.file.path);
//         try {

//             const utilisateurConnecteRole = req.user.typeUserId;
//             const utilisateurConnecte = req.user.isConnect;
            
//             if (utilisateurConnecte==false) {
//                 return res.status(401).json({ status: false, message: 'Vous devez être connecté pour enregistrer un produit.' });
//             }
//             const roleUser = await TypeUtilisateur.findOne({ where: { typeUserId: utilisateurConnecteRole } });
//             if (!roleUser || (roleUser.libelle !== "Admin" && roleUser.libelle !== "Super Admin")) {
//                 return res.status(403).json({ status: false, message: 'Vous n\'avez pas les autorisations nécessaires pour enregistrer un produit.' });
//             }

//             const resizedImageBuffer = await sharp(imageBuffer)
//             .resize({ width: 100, height: 100 }) // Redimensionnement de l'image
//             .toBuffer();
//             const base64Image = resizedImageBuffer.toString('base64');
//             // const { nom,prenom,email, password,address,telephone,typeUserId,imageClient } = req.body;
        
//             //Vérifier si l'utilisateur existe déjà
//             const email = req.body.email;
//             const telephone = req.body.telephone;

//             const existingUser = await Utilisateur.findOne({ where: { email } });
//             const numberUser = await Utilisateur.findOne({ where: { telephone } });
//             if (existingUser) {
//               return res.status(400).json({ status: false, message: 'Cet utilisateur existe déjà.' });
//             }else if (numberUser) {
//                 return res.status(400).json({ status: false, message: 'Ce numero de telephone existe déjà.' }); 
//             }

        
//             // Hacher le mot de passe
//             const hashedPassword = await bcrypt.hash(req.body.password, 10);
        
//             // Créer un nouvel utilisateur
//             const newUser = await Utilisateur.create({
//               nom:req.body.nom,
//               prenom:req.body.prenom,
//               email:req.body.email,
//               password: hashedPassword,
//               // address:req.body.address,
//               telephone:req.body.telephone,
//               image : base64Image,
//               typeUserId:req.body.typeUserId,
//               dateNaissance:req.body.dateNaissance,
//               genre:req.body.genre,
//               ville:req.body.ville,
//               isConnect:false,
//               isValid:true,
//               accountManager:req.user.nom+" "+req.user.prenom
//             });

//             if (newUser) {
//                 sendEmail(
//                     email,
//                     'Felicitation',
//                     '\<p>Cher utilisateur,</p><p>nous vous felicitons pour votre compte crée en tant que '+roleUser.libelle+'.</p>\
//                         <p>Votre mot de passe par défaut est:'+req.body.password+'</p>\
//                         <p>Cordialement,</p>\
//                         <p>L\'equipe yasmine,</p>',
//                   (error, info) => {
//                     if (error) {
//                       console.log('Erreur lors de l\'envoi de l\'e-mail :', error);
//                     } else {
//                       console.log('E-mail envoyé avec succès :', info.response);
//                     }
//                   }
//                   );
//                   const messageAdmin='L\'utilisateur à bien été enregistré '
//                   return res.status(201).json({status:true, message: messageAdmin});
//             }
              
             
            
//           } catch (error) {
//             if (error.name === 'SequelizeValidationError') {
//                 // Si une erreur de validation Sequelize se produit, renvoyez une réponse avec le statut 400 (Bad Request) et les messages d'erreur
//                 const validationErrors = error.errors.map(err => err.message);
//                 res.status(400).json({ errors: validationErrors });
//               } else {
//                 // Si une autre erreur se produit, renvoyez une réponse avec le statut 500 (Internal Server Error) et un message d'erreur générique
//                 res.status(500).json({ error: 'Une erreur est survenue lors de la création de l\'utilisateur.',errors:error.message });
//               }
//             // console.error(error);
//             // return res.status(500).json({ message: 'Une erreur est survenue lors de l\'inscription.' });
//           }finally {
//             // Supprimer le fichier original
//             // fs.unlinkSync(req.file.path);
//           }
//     });
  
// };


// module.exports = {
//     registerAdminUser
// };