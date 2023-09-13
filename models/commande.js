'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Commande extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Commande.init({
    commandeId: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Définir cette colonne comme clé primaire si nécessaire
      autoIncrement: true, // Activer l'auto-incrémentation si nécessaire
    },
    date: DataTypes.DATE,
    commandeStatus: DataTypes.STRING,
    // UtilisateurId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Commande',
  });
  Commande.associate = (models) => {
    Commande.belongsTo(models.CodePromo, { foreignKey: 'CodeId' });
  };
  return Commande;
};