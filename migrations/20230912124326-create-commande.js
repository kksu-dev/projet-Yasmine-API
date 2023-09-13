'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Commandes', {
      
      commandeId: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      date: {
        type: Sequelize.DATE
      },
      commandeStatus: {
        type: Sequelize.STRING
      },
      // UtilisateurId: {
      //   type: Sequelize.INTEGER
      // },
   

      UtilisateurId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Utilisateurs', // Nom de la table à laquelle la clé étrangère se réfère
          key: 'UtilisateurId', // Nom de la colonne dans la table "Commandes" à laquelle la clé étrangère se réfère
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
    await queryInterface.dropTable('Commandes');
  }
};