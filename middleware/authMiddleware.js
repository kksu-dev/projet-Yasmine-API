const jwt = require('jsonwebtoken');
require('dotenv');

function verifyToken(req, res, next) {
  const token = req.headers.authorization;
  // return token;
  if (!token) {
    return res.status(403).json({ message: 'Token manquant' });
  }
  const tokenV = token.split(' ')[1];
  jwt.verify(tokenV, process.env.JWT_SECRET, (err, decoded) => {
    
    if (err) {
      return res.status(401).json({ message: 'Token invalide', test:req.headers.authorization, token:tokenV });
    }
    req.user = decoded;
    next();
  });
}

module.exports = verifyToken;