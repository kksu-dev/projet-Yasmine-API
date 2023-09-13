'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class CodePromo extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  CodePromo.init({
    CodeId:{
      type: DataTypes.INTEGER,
      primaryKey: true, // Définir cette colonne comme clé primaire si nécessaire
      autoIncrement: true, // Activer l'auto-incrémentation si nécessaire
    },
    code: {
      type: DataTypes.STRING,
      allowNull: true,      
    },
    reduction: {
      type: DataTypes.STRING,
      allowNull: true,      
    },
    expirationDate: {
      type: DataTypes.DATE,
      allowNull: true,      
    }
  }, {
    sequelize,
    modelName: 'CodePromo',
  });
  return CodePromo;
};