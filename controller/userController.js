
// const Utilisateur = require('../models/Utilisateur');
const bcrypt = require('bcrypt');
const { Utilisateur } = require('../models');
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');
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
            const confirmationMessage = 'Utilisateur créé avec succès.';
            return res.status(201).json({message: confirmationMessage, data: newUser});
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

module.exports = {
  registerUser,
};
