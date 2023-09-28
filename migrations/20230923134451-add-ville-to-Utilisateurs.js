'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Utilisateurs', 'ville', {
      type: Sequelize.STRING,
      allowNull: true, // Vous pouvez définir cette option en fonction de vos besoins
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Utilisateurs', 'ville');
  }
};

