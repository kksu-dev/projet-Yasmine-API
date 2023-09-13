'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class TypeUtilisateur extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  TypeUtilisateur.init({
    typeUserId: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Définir cette colonne comme clé primaire si nécessaire
      autoIncrement: true, // Activer l'auto-incrémentation si nécessaire
    },
    libelle: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'TypeUtilisateur',
  });
  return TypeUtilisateur;
};