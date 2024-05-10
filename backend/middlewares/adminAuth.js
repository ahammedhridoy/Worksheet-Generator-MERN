const jwt = require("jsonwebtoken");

const adminAuthMiddleware = (req, res, next) => {
  // Get the JWT token from the request cookies or headers
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

  try {
    // Verify and decode the JWT token
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

    // Attach the decoded user object to the request object
    req.user = decodedToken;

    // Check if the user has the admin role
    if (req.user.role !== "ADMIN") {
      return res
        .status(403)
        .json({ error: "Forbidden: Admin access required" });
    }

    next();
  } catch (error) {
    return res.status(401).json({ error: "Unauthorized: Invalid token" });
  }
};

module.exports = adminAuthMiddleware;
