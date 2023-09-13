'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Panier extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Panier.init({
    PanierId: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Définir cette colonne comme clé primaire si nécessaire
      autoIncrement: true, // Activer l'auto-incrémentation si nécessaire
    },
    quantite: DataTypes.INTEGER,
    totalPrix: DataTypes.FLOAT,
    // UtilisateurId: DataTypes.INTEGER,
    // ProduitId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Panier',
  });
  Panier.associate = (models) => {
    Panier.belongsTo(models.Utilisateur, { foreignKey: 'UtilisateurId' });
    Panier.belongsTo(models.Produit, { foreignKey: 'ProduitId' });
  };
  return Panier;
};