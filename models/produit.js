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
    nomProduit: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'le nom du produit est requis.',
        },
      },
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'la description est requise.',
        },
      },
    },
    prix: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'le prix est requis.',
        },
      },
    },
    stock: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'le stock est requis.',
        },
      },
    },
    image: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'l\'image est requis.',
        },
      },
    },
    productOrdered: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'le productOrdered est requis.',
        },
      },
    },
    categorieProduitId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'le categorie produit est requis.',
        },
      },
    },
    UtilisateurId:{
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'le user id est requis.',
        },
      },
    },
    identifiantProduit:{
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'l\'identifiant Produit est requis.',
        },
      },
    },
  }, {
    sequelize,
    modelName: 'Produit',
  });
  Produit.associate = (models) => {
    Produit.belongsTo(models.CategorieProduit, { foreignKey: 'categorieProduitId' });
  };

  Produit.associate = (models) => {
    Produit.belongsTo(models.Utilisateur, { foreignKey: 'UtilisateurId' });
  };

  return Produit;
};