const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  let token;

  // Check if token is present in cookies
  if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  // Check if token is present in headers
  else if (req.headers.authorization || req.headers.Authorization) {
    const authHeader = req.headers.authorization;
    const tokenParts = authHeader.split(" ");
    if (tokenParts.length === 2 && tokenParts[0] === "Bearer") {
      token = tokenParts[1];
    }
  }

  // Check if token is found
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = decoded;

    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = authMiddleware;
