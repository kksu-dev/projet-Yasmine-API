'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Avis extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Avis.init({
    avisId: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Définir cette colonne comme clé primaire si nécessaire
      autoIncrement: true, // Activer l'auto-incrémentation si nécessaire
    },
    stars:  {
      type: DataTypes.INTEGER,
      allowNull: true,      
    },
    comment: {
      type: DataTypes.TEXT,
      allowNull: true,      
    },
    // UtilisateurId: DataTypes.INTEGER,
    // ProduitId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Avis',
  });
  Avis.associate = (models) => {
    Avis.belongsTo(models.Utilisateur, { foreignKey: 'UtilisateurId' });
    Avis.belongsTo(models.Produit, { foreignKey: 'ProduitId' });
  };
  return Avis;
};