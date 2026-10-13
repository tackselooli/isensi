const cors = require('cors');

const allowedOrigins = ['http://localhost:5173']; // Add your frontend URL here

const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies to be sent with requests
};

module.exports = cors(corsOptions);