'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class ListeDeSouhaits extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  ListeDeSouhaits.init({
    souhaitId: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Définir cette colonne comme clé primaire si nécessaire
      autoIncrement: true, // Activer l'auto-incrémentation si nécessaire
    },
    dateAjout: DataTypes.DATE,
    // UtilisateurId: DataTypes.INTEGER,
    // ProduitId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'ListeDeSouhaits',
  });
  ListeDeSouhaits.associate = (models) => {
    ListeDeSouhaits.belongsTo(models.Utilisateur, { foreignKey: 'UtilisateurId' });
    ListeDeSouhaits.belongsTo(models.Produit, { foreignKey: 'ProduitId' });
  };

  return ListeDeSouhaits;
};