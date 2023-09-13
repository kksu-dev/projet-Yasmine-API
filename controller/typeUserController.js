
// const Utilisateur = require('../models/Utilisateur');
const bcrypt = require('bcrypt');
const { TypeUtilisateur } = require('../models');

// Fonction pour créer un nouvel utilisateur
const registerUser = async (req, res) => {
  try {
    const { libelle} = req.body;

    // Vérifier si l'utilisateur existe déjà
    // const existingUser = await Utilisateur.findOne({ where: { email } });
    // if (existingUser) {
    //   return res.status(400).json({ message: 'Cet utilisateur existe déjà.' });
    // }

    // // Hacher le mot de passe
    // const hashedPassword = await bcrypt.hash(password, 10);

    // Créer un nouvel utilisateur
    const newUser = await TypeUtilisateur.create({
        libelle,
      
    });

    return res.status(201).json(newUser);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Une erreur est survenue lors de l\'inscription.' });
  }
};

module.exports = {
  registerUser,
};
