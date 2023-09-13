'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Produit extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Produit.init({
    ProduitId: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Définir cette colonne comme clé primaire si nécessaire
      autoIncrement: true, // Activer l'auto-incrémentation si nécessaire
    },
    nomProduit: DataTypes.STRING,
    description: DataTypes.TEXT,
    prix: DataTypes.FLOAT,
    stock: DataTypes.INTEGER,
    image: DataTypes.STRING,
    productOrdered: DataTypes.BOOLEAN,
    // categorieProduitId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Produit',
  });
  Produit.associate = (models) => {
    Produit.belongsTo(models.CategorieProduit, { foreignKey: 'categorieProduitId' });
  };

  return Produit;
};