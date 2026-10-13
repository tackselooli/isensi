const { verifyToken } = require('../config/jwtConfig');

function verifyJWT(req, res, next) {
  const token = req.cookies.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    req.decoded = verifyToken(token);
    next();
  } catch (err) {
    res.status(403).json({ message: "Forbidden or token has expired" });
  }
}

async function verifyAdmin(req, res, next) {
  const userCollection = req.app.locals.userCollection;
  const email = req.decoded.email;
  const user = await userCollection.findOne({ email });

  if (user && user.role === "admin") {
    next();
  } else {
    res.status(401).json({ message: "Unauthorized access" });
  }
}

async function verifyInstructor(req, res, next) {
    try {
        if (!req.decoded || !req.decoded.email) {
          return res.status(401).send({ error: true, message: "Unauthorized access" });
        }
        const email = req.decoded.email;
        const query = { email: email };
        const user = await userCollection.findOne(query);
        if (user && (user.role === "instructor" || user.role === "admin")) {
          next();
        } else {
          return res.status(401).send({ error: true, message: "Unauthorized access" });
        }
      } catch (error) {
        console.error("Error verifying instructor:", error);
        res.status(500).send({ error: true, message: "Internal Server Error" });
      }
}

module.exports = { verifyJWT, verifyAdmin, verifyInstructor };
