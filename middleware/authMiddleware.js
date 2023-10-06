const jwt = require('jsonwebtoken');
const { Utilisateur} = require('../models');
require('dotenv');

function authenticateUser(req, res, next) {
  const token = req.headers.authorization;
  // return token;
  if (!token) {
    return res.status(403).json({ message: 'Token manquant' });
  }
  const tokenV = token.split(' ')[1];
  jwt.verify(tokenV, process.env.JWT_SECRET, async (err, decodedToken) => {
    
    if (err) {
      return res.status(401).json({ message: 'Token invalide' });
    }
    const userId = decodedToken.userId;
    // const users = Utilisateur.findOne((u) => u.UtilisateurId === userId);
    const users = await Utilisateur.findOne({ where: { UtilisateurId: userId} });
    req.user = users;
    next();
  });
}
module.exports = authenticateUser;