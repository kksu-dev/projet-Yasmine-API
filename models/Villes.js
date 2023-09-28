'use strict';
const {Model} = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Villes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Villes.init({
    id_ville: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Définir cette colonne comme clé primaire si nécessaire
      autoIncrement: true, // Activer l'auto-incrémentation si nécessaire
    },
    Identifiant:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'l\'Identifiant est requis.',
        },
      },
    },
    Libelle: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Le libelle est requis.',
        },
       
      },
    }, 
  }, {
    sequelize,
    modelName: 'Villes',
  });
 
  return Villes;
};