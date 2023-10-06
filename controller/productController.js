const { Produit,Utilisateur,TypeUtilisateur } = require('../models');
const multer = require('multer');
const fs = require('fs');
const sharp = require('sharp');

const getAllProduit = async (req, res) => {
  try {
    // const produitAll = await Produit.findAll();
    const produitAll = await Produit.findAll({
      include: [Utilisateur], // Effectuez une jointure avec la table TypeUser
    });
    res.status(200).json({ success: true, data: produitAll });
  } catch (error) {
    console.error('Erreur lors de la récupération des produits :', error);
    res.status(500).json({ status:false, message: 'Une erreur est survenue lors de la récupération des produits:', error });
  }
};

const Storage = multer.diskStorage(
    {
      destination:'produits',
      filename:(req,file,cb)=>{
        cb(null,file.originalname)
        // cb(null,Date.now() + "-" +'user')
        
      }
    }
);
  
const upload = multer({ storage:Storage,limits: { fileSize: 50 * 1024 * 1024 }, }).single('imageProduit');
const registerProduct = async (req, res) => {
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
        const imageBuffer = fs.readFileSync(req.file.path);
 
        try {
            const utilisateurConnecteRole = req.user.typeUserId;
            const utilisateurConnecte = req.user.isConnect;
            if (utilisateurConnecte==false) {
                return res.status(401).json({ status: false, message: 'Vous devez être connecté pour enregistrer un produit.' });
            }
            const roleUser = await TypeUtilisateur.findOne({ where: { typeUserId: utilisateurConnecteRole } });
            if (!roleUser || (roleUser.libelle !== "Admin" && roleUser.libelle !== "Super Admin")) {
                return res.status(403).json({ status: false, message: 'Vous n\'avez pas les autorisations nécessaires pour enregistrer un produit.' });
            }
            const resizedImageBuffer = await sharp(imageBuffer)
            .resize({ width: 100, height: 100 }) // Redimensionnement de l'image
            .toBuffer();
            const base64Image = resizedImageBuffer.toString('base64');

            const produitsExistants = await Produit.count();
            const prochainNumero = produitsExistants + 1;

            // Formattez le numéro avec des zéros pour avoir une longueur de 4 chiffres
            const numeroFormate = `000${prochainNumero}`.slice(-4);
            // Créez l'identifiant du produit au format souhaité
            const identifiantUnique = `PRODYAS${numeroFormate}`;

            const newProduct = await Produit.create({
                nomProduit:req.body.nomProduit,
                description:req.body.description,
                prix:req.body.prix,
                stock: req.body.stock,
                image : base64Image,
                UtilisateurId:req.user.UtilisateurId,
                productOrdered:req.body.productOrdered,
                categorieProduitId:req.body.categorieProduitId,
                identifiantProduit:identifiantUnique,
              
            });

            if (newProduct) {
              const message = 'Le produit à bien été enregistré';
              return res.status(201).json({status:true, message: message});
            }
                 

        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                // Si une erreur de validation Sequelize se produit, renvoyez une réponse avec le statut 400 (Bad Request) et les messages d'erreur
                const validationErrors = error.errors.map(err => err.message);
                return res.status(400).json({ errors: validationErrors });
              } else {
                // Si une autre erreur se produit, renvoyez une réponse avec le statut 500 (Internal Server Error) et un message d'erreur générique
                return res.status(500).json({ errors: 'Une erreur est survenue lors de la création du produit.',error: error.message });
              }
           
          }finally {
            // Supprimer le fichier original
            // fs.unlinkSync(req.file.path);
        }
    });
};

const updateProduct = async (req,res)=>{

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
                return res.status(401).json({ status: false, message: 'Vous devez être connecté pour enregistrer un produit.' });
            }
            const roleUser = await TypeUtilisateur.findOne({ where: { typeUserId: utilisateurConnecteRole } });
            if (!roleUser || (roleUser.libelle !== "Admin" && roleUser.libelle !== "Super Admin")) {
                return res.status(403).json({ status: false, message: 'Vous n\'avez pas les autorisations nécessaires pour enregistrer un produit.' });
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

            const updateData = {
                nomProduit: req.body.nomProduit,
                description: req.body.description,
                prix: req.body.prix,
                stock: req.body.stock,
                UtilisateurId:req.user.UtilisateurId,
                productOrdered: req.body.productOrdered,
                categorieProduitId: req.body.categorieProduitId,
            };
            // Si un nouveau fichier image a été sélectionné,on l'ajoutez au tableau 
            if (req.file) {
                updateData.image = base64Image;
            }
            const [updatedRowsProduit] = await Produit.update(
                updateData,
                { where: { ProduitId: req.body.produiId } }
            );      
              if (updatedRowsProduit > 0) {
                return res.status(200).json({ status: true, message: 'Le produit a été mis à jour avec succès.' });
              } else {
                return res.status(404).json({ status: false, message: 'Aucun produit n\'a été trouvée pour la mise à jour.' });
              }

                 

        } catch (error) {
            if (error.name === 'SequelizeValidationError') {
                // Si une erreur de validation Sequelize se produit, renvoyez une réponse avec le statut 400 (Bad Request) et les messages d'erreur
                const validationErrors = error.errors.map(err => err.message);
                return res.status(400).json({ errors: validationErrors });
              } else {
                // Si une autre erreur se produit, renvoyez une réponse avec le statut 500 (Internal Server Error) et un message d'erreur générique
                return res.status(500).json({ errors: 'Une erreur est survenue lors de la création du produit.',error: error.message });
              }
           
          }finally {
            // Supprimer le fichier original
            // fs.unlinkSync(req.file.path);
        }
    });
}

const deleteProduct = async (req, res) => {
    try {
        const utilisateurConnecteRole = req.user.typeUserId;
        const utilisateurConnecte = req.user.isConnect;
        
        if (utilisateurConnecte==false) {
            return res.status(401).json({ status: false, message: 'Vous devez être connecté pour enregistrer un produit.' });
        }
        const roleUser = await TypeUtilisateur.findOne({ where: { typeUserId: utilisateurConnecteRole } });
        if (!roleUser || (roleUser.libelle !== "Admin" && roleUser.libelle !== "Super Admin")) {
            return res.status(403).json({ status: false, message: 'Vous n\'avez pas les autorisations nécessaires pour enregistrer un produit.' });
        }

        const { ProduitIds } = req.body; 
    
        const result = await Produit.destroy({
          where: {
            ProduitId: ProduitIds,
          },
        });
    
        if (result > 0) {
          return res.status(200).json({ status: true, message: 'Les produits ont été supprimés avec succès.' });
        } else {
          return res.status(404).json({ status: false, message: 'Aucun produit n\'a été trouvé pour la suppression.' });
        }
      } catch (error) {
        console.error(error);
        return res.status(500).json({ status: false, message: 'Une erreur est survenue lors de la suppression des produits.', errors:error.message });
      }
};
module.exports = {
    getAllProduit,
    registerProduct,
    updateProduct,
    deleteProduct
};
