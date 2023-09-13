'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Livraison extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Livraison.init({
    livraisonId: {
      type: DataTypes.INTEGER,
      primaryKey: true, // Définir cette colonne comme clé primaire si nécessaire
      autoIncrement: true, // Activer l'auto-incrémentation si nécessaire
    },
    DateLivraisonPrevu: DataTypes.DATE,
    DateLivraisonEffective: DataTypes.DATE,
    statusLivraison: DataTypes.STRING,
    // commandeId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Livraison',
  });
  Livraison.associate = (models) => {
    Livraison.belongsTo(models.Commande, { foreignKey: 'commandeId' });
  };
  return Livraison;
};