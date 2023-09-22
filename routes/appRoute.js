const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const typeUserController = require('../controller/typeUserController');
const verifyToken = require('../middleware/authMiddleware');
require('dotenv');


  // Route pour obtenir le profil de l'utilisateur connecté
  router.get('/profil', verifyToken, (req, res) => {
    const user = req.user.utilisateur;
    res.json({ user });
  });
//Route pour recuperer tous les utilisateurs
router.get('/getUsers', userController.getAllUser);

// Route pour s'inscrire sur l'app
router.post('/register', userController.registerUser);

// Route pour inscrire le type d'utilisateur
router.post('/registerTypeUser', typeUserController.registerUser);

// Route pour connecter un utilisateur
router.post('/connexion', userController.connexionUser);

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

module.exports = router;
