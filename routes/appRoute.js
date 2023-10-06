const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const adminUserController = require('../controller/adminUserController');
const typeUserController = require('../controller/typeUserController');
const villeController = require('../controller/villeController');
const categorieProductController = require('../controller/categorieProductController');
const productController = require('../controller/productController');
const verifyToken = require('../middleware/authMiddleware');
const authenticateUser = require('../middleware/authMiddleware');
require('dotenv');


  // Route pour obtenir le profil de l'utilisateur connecté
  router.get('/profil', authenticateUser, (req, res) => {
    const user = req.user;
    res.json({ user });
  });
//Route pour recuperer tous les utilisateurs
router.get('/getUsers', userController.getAllUser);

//suspendre un utilisateur
router.post('/deleteUsers', userController.deleteUser);
//activer un utilisateur
router.post('/activeUsers', userController.activeUser);

// Route pour s'inscrire sur l'app
router.post('/register', userController.registerUser);
// Route pour s'inscrire un admin sur l'app
router.post('/registerAdmin',authenticateUser, adminUserController.registerAdminUser);
// Route pour recuperer un user par son id
router.post('/getUserById', adminUserController.getUserByIdForUpdate);
// Route pour modifier un user 
router.put('/updateUser',authenticateUser, adminUserController.updateAdminUser);
// Route pour verifier si le user existe
router.post('/verifUser', userController.verifExistUser);
// Route pour connecter un utilisateur
router.post('/connexion', userController.connexionUser);

// Route pour deconnecter un utilisateur
router.post('/deconnexion', userController.deconnectUser);

//route pour generer un otp et la valider
router.post('/generateOtp', userController.generateOtp);
router.post('/validOtp', userController.validOtpUser);

//route pour mettre a jour le mot de passe
router.post('/reset-password', userController.restPassword);
router.post('/verificationOtp', userController.verificationOtp);
router.post('/changePassword', userController.changePassword);

//teste sms
router.post('/sms', userController.testSms);
// router.post('/mail', userController.testmail);


// Route pour inscrire le type d'utilisateur
router.post('/registerTypeUser', typeUserController.registerUser);
router.get('/getTypeUser', typeUserController.getAllTypeUser);

//Route pour enregistrer la ville
router.get('/getVille', villeController.getAllVille);



//********************** ROUTES POUR LES PRODUITS */
//route pour enregistrer une categorie produit
router.post('/registerCategorieProduct', categorieProductController.registerCategorieProduct);
//route pour modifier une categorie produit
router.put('/updateCategorieProduct', categorieProductController.updateCategorieProduct);
//route pour recuperer les categories produits
router.get('/getCategorieProduit', categorieProductController.getAllCategorieProduit);
//route pour supprimer les categories produits
router.delete('/deleteCategorieProduit', categorieProductController.deleteCategorieProduct);


//route pour enregistrer un produit
router.post('/registerProduct',authenticateUser, productController.registerProduct);

//route pour recuperer tous les produits
router.get('/getProduit', productController.getAllProduit);

//route pour modifier un produit
router.put('/updateProduit',authenticateUser, productController.updateProduct);
//route pour supprimer un produit
router.delete('/deleteProduit',authenticateUser, productController.deleteProduct);
module.exports = router;
