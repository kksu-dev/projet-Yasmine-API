'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('DetailCommandes', {
      
      DetailCommandeId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      quantite: {
        type: Sequelize.INTEGER
      },
      PrixUnitaire: {
        type: Sequelize.FLOAT
      },
      totalMontant: {
        type: Sequelize.FLOAT
      },
      // commandeId: {
      //   type: Sequelize.INTEGER
      // },
      // ProduitId: {
      //   type: Sequelize.INTEGER
      // },

      ProduitId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Produits', // Nom de la table à laquelle la clé étrangère se réfère
          key: 'ProduitId', // Nom de la colonne dans la table "Commandes" à laquelle la clé étrangère se réfère
        },
        onUpdate: 'CASCADE', // Option de mise à jour en cascade si nécessaire
        onDelete: 'CASCADE', // Option de suppression en cascade si nécessaire
      },

      commandeId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Commandes', // Nom de la table à laquelle la clé étrangère se réfère
          key: 'commandeId', // Nom de la colonne dans la table "Commandes" à laquelle la clé étrangère se réfère
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
    await queryInterface.dropTable('DetailCommandes');
  }
};