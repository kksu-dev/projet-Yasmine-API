'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Utilisateur extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Utilisateur.init({
    UtilisateurId: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Définir cette colonne comme clé primaire si nécessaire
      autoIncrement: true, // Activer l'auto-incrémentation si nécessaire
    },
    nom:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'le nom est requis.',
        },
      },
    },
    prenom: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Le prenom e-mail est requis.',
        },
       
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Le mot de passe est requis.',
        },
        len: {
          args: [6],
          msg: 'votre mot de passe doit avoir au moins 6 longueurs.',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      // unique: true,
      unique: {
        args: true,
        msg: 'Cette adresse e-mail est déjà utilisée.',
      },
      validate: {
        notNull: {
          msg: 'L\'adresse e-mail est requise.',
        },
        isEmail: {
          msg: 'L\'adresse e-mail doit être au format valide.',
        },
      },
    },
    address: DataTypes.STRING,
    telephone: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        args: true,
        msg: 'Ce numero de telephone est déjà utilisé.',
      },
      validate: {
        notNull: {
          msg: 'Le numéro de téléphone est requis.',
        },
        isNumeric: {
          msg: 'Le numéro de téléphone doit contenir uniquement des chiffres.',
        },
        len: {
          args: [10],
          msg: 'Le numéro de téléphone doit avoir 10 chiffres.',
        },
      },
    },
    image: {
      type: DataTypes.STRING,
    },
    typeUserId: DataTypes.INTEGER,
    dateNaissance: {
      type: DataTypes.DATE,
    },
    genre: {
      type: DataTypes.STRING,
    },
    resetToken:{
      type: DataTypes.STRING,
      allowNull: true,
    }
  }, {
    sequelize,
    modelName: 'Utilisateur',
  });
  Utilisateur.associate = (models) => {
    Utilisateur.belongsTo(models.TypeUtilisateur, { foreignKey: 'typeUserId' });
  };
  return Utilisateur;
};