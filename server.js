const express = require('express');
const app = express();
const sequelize = require('./config/bdConnect'); 
const appRoutes = require('./routes/appRoute');
const bodyParser = require('body-parser');
const cors = require('cors');
app.use(cors());
// Middleware pour analyser les requêtes JSON
app.use(express.json());


// Définissez vos options CORS personnalisées ici
const corsOptions = {
  // origin: 'http://example.com', // Remplacez par l'URL de votre application front-end
  methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
  optionsSuccessStatus: 204, // Réponse pour les requêtes OPTIONS (pré-vérification CORS)
  maxAge: 3600, // Durée de validité en secondes pour les résultats pré-vérification CORS
  allowedHeaders: 'Content-Type,Authorization', // Les en-têtes HTTP autorisés
};

// Appliquez le middleware CORS avec vos options personnalisées
app.use(cors(corsOptions));

app.use((error, req, res, next) => {
  if (error instanceof SyntaxError && error.status === 400 && 'body' in error) {
    return res.status(400).json({ status: false, message: 'Erreur de syntaxe JSON', errors:error.message });
  }
  next();
});

app.use('/api/v1', appRoutes);
app.use(bodyParser.json({ limit: '100mb' }));
app.use(bodyParser.urlencoded({ limit: '100mb', extended: true }));

sequelize.sync()
  .then(() => {
    console.log('La base de données est connectée.');
  })
  .catch((error) => {
    console.error('Erreur de connexion à la base de données:', error);
  });

const PORT = process.env.PORT || 3000;

app.listen(PORT, '127.0.0.1', function () {
    
    console.log('API démarré avec succès sur le port : ' + PORT);
});
