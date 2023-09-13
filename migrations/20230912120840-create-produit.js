'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Produits', {
      
      ProduitId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      nomProduit: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT
      },
      prix: {
        type: Sequelize.FLOAT
      },
      stock: {
        type: Sequelize.INTEGER
      },
      image: {
        type: Sequelize.STRING
      },
      productOrdered: {
        type: Sequelize.BOOLEAN
      },

      categorieProduitId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'CategorieProduits', // Nom de la table à laquelle la clé étrangère se réfère
          key: 'categorieProduitId', // Nom de la colonne dans la table "Commandes" à laquelle la clé étrangère se réfère
        },
        onUpdate: 'CASCADE', // Option de mise à jour en cascade si nécessaire
        onDelete: 'CASCADE', // Option de suppression en cascade si nécessaire
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Produits');
  }
};