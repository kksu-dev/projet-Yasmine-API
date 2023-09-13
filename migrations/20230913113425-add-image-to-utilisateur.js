'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Utilisateurs', 'image', {
      type: Sequelize.STRING,
      allowNull: true, // Vous pouvez spécifier si l'image est facultative ou obligatoire
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Utilisateurs', 'image');
  }
};

