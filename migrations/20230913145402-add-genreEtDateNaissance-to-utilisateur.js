'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Utilisateurs', 'dateNaissance', {
      type: Sequelize.DATE,
      allowNull: true, // Vous pouvez changer cette option en fonction de vos besoins
    });

    await queryInterface.addColumn('Utilisateurs', 'genre', {
      type: Sequelize.STRING,
      allowNull: true, // Vous pouvez changer cette option en fonction de vos besoins
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Utilisateurs', 'dateNaissance');
    await queryInterface.removeColumn('Utilisateurs', 'genre');
  },
};
