const jwt = require("jsonwebtoken");

module.exports = (roles = []) => {
  return (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ message: "No token provided." });

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = decoded; //  THIS IS ESSENTIAL

      if (roles.length && !roles.includes(decoded.role)) {
        return res.status(403).json({ message: "Access denied." });
      }

      next();
    } catch (err) {
      return res.status(401).json({ message: "Invalid token." });
    }
  };
};
