
// const Utilisateur = require('../models/Utilisateur');
// const bcrypt = require('bcrypt');
const { TypeUtilisateur } = require('../models');


// const getAllTypeUser = async (req,res) => {
//   try {
//     const TypeUtilisateur = await TypeUtilisateur.findAll(); 

//     res.status(200).json({success:true, data:TypeUtilisateur});
//   } catch (error) {
//     console.error('Erreur lors de la récupération des types utilisateurs :', error);
//     res.status(500).json({ success:false,message: 'Une erreur est survenue lors de la récupération des types utilisateurs:',error });
//   }
// }

const getAllTypeUser = async (req, res) => {
  try {
    const typeUtilisateurs = await TypeUtilisateur.findAll();

    res.status(200).json({ success: true, data: typeUtilisateurs });
  } catch (error) {
    console.error('Erreur lors de la récupération des types utilisateurs :', error);
    res.status(500).json({ success: false, message: 'Une erreur est survenue lors de la récupération des types utilisateurs:', error });
  }
};


// Fonction pour créer un nouvel utilisateur
const registerUser = async (req, res) => {
  try {
    const { libelle} = req.body;
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
  getAllTypeUser
};
