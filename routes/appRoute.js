const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const typeUserController = require('../controller/typeUserController');

// Route pour s'inscrire
router.post('/register', userController.registerUser);
router.post('/registerTypeUser', typeUserController.registerUser);

module.exports = router;
