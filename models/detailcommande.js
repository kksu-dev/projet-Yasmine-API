'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class DetailCommande extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  DetailCommande.init({
    DetailCommandeId: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Définir cette colonne comme clé primaire si nécessaire
      autoIncrement: true, // Activer l'auto-incrémentation si nécessaire
    },
    quantite: DataTypes.INTEGER,
    PrixUnitaire: DataTypes.FLOAT,
    totalMontant: DataTypes.FLOAT,
    // commandeId: DataTypes.INTEGER,
    // ProduitId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'DetailCommande',
  });
  DetailCommande.associate = (models) => {
    DetailCommande.belongsTo(models.Commande, { foreignKey: 'commandeId' });
    DetailCommande.belongsTo(models.Produit, { foreignKey: 'ProduitId' });
  };
  return DetailCommande;
};