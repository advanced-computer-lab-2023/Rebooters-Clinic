const jwt = require('jsonwebtoken');

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  const type = req.cookies.userType;
  
  if (!token) {
    return res.status(401).json({ message: "You are not logged in." });
  }

  jwt.verify(token, 'supersecret', (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (type === 'patient' && req.originalUrl.startsWith('/api/patient')) {
      // Allow access to patient routes.
      return next();
    } 
    else if (type === 'admin' && req.originalUrl.startsWith('/api/admin')) {
      // Allow access to admin routes.
      return next();
    }
    else if (type === 'doctor' && req.originalUrl.startsWith('/api/doctor')) {
      // Allow access to doctor routes.
      return next();
    }
    else {
      return res.status(403).json({ message: "Access denied." });
    }
  });
};

module.exports = { requireAuth };
