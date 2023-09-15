const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const typeUserController = require('../controller/typeUserController');

// Route pour s'inscrire
router.post('/register', userController.registerUser);
router.post('/registerTypeUser', typeUserController.registerUser);

//route pour generer un otp et la valider
router.post('/generateOtp', userController.generateOtp);
router.post('/validOtp', userController.validOtpUser);


//teste sms
router.post('/sms', userController.testSms);

module.exports = router;
