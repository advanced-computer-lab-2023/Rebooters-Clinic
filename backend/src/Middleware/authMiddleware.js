const jwt = require("jsonwebtoken");

const requireAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  const type = req.cookies.userType;
  const username = req.cookies.username;

  if (!token) {
    return res.status(401).json({ message: "You are not logged in." });
  }

  jwt.verify(token, "supersecret", (err, decodedToken) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    if (
      type === "patient" &&
      (req.originalUrl.startsWith("/api/patient") ||
        req.originalUrl.startsWith("/patient-home"))
    ) {
      return next();
    }
    if (
      type === "admin" &&
      (req.originalUrl.startsWith("/api/admin") ||
        req.originalUrl.startsWith("/admin"))
    ) {
      return next();
    }
    if (
      type === "doctor" &&
      (req.originalUrl.startsWith("/api/doctor") ||
        req.originalUrl.startsWith("/doctor-home"))
    ) {
      return next();
    }

    return res.status(403).json({ message: "Access denied." });
  });
};

module.exports = { requireAuth };
