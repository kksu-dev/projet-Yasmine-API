const express = require('express');
const app = express();
const sequelize = require('./config/bdConnect'); 
const appRoutes = require('./routes/appRoute');

// Middleware pour analyser les requêtes JSON
app.use(express.json());

// Utilisez les routes liées aux utilisateurs
app.use('/api/v1', appRoutes);

// Synchronisez le modèle Sequelize avec la base de données
sequelize.sync()
  .then(() => {
    console.log('La base de données est connectée.');
  })
  .catch((error) => {
    console.error('Erreur de connexion à la base de données:', error);
  });

const PORT = process.env.PORT || 3000;
// app.listen(PORT, () => {
//   console.log(`Serveur en cours d'exécution sur le port ${PORT}`);
// });
app.listen(PORT, '127.0.0.1', function () {
    
    console.log('API démarré avec succès sur le port : ' + PORT);
});

// DB_HOST=localhost
// DB_PORT=3306
// DB_NAME=monassocicom_yasmineBd
// DB_USER=monassocicom_admin
// DB_PASSWORD=Monasso@2022