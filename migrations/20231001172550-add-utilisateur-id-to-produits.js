'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Produits', 'UtilisateurId', {
      type: Sequelize.INTEGER,
      allowNull: false,
      references: {
        model: 'Utilisateurs',
        key: 'UtilisateurId',
      },
      onUpdate: 'CASCADE',
      onDelete: 'CASCADE',
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Produits', 'UtilisateurId');
  },
};

