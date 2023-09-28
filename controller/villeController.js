
// const Utilisateur = require('../models/Utilisateur');
// const bcrypt = require('bcrypt');
const { Villes } = require('../models');

const getAllVille = async (req, res) => {
  try {
    const villeAll = await Villes.findAll();

    res.status(200).json({ success: true, data: villeAll });
  } catch (error) {
    console.error('Erreur lors de la récupération de la ville :', error);
    res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la récupération de la ville:', error });
  }
};



module.exports = {
    getAllVille
};
