const jwt = require('jsonwebtoken');

function generateToken(user) {
  return jwt.sign(user, process.env.ACCESS_SECRET, { expiresIn: '24h' });
}

function verifyToken(token) {
  return jwt.verify(token, process.env.ACCESS_SECRET);
}

module.exports = { generateToken, verifyToken };