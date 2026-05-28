const jwt = require("jsonwebtoken");
const httpresponser = require("../utils/httpjsend");

const auth = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader) {
    return res.status(401).json({
      status: httpresponser.FAIL,
      error: "No token provided",
    });
  }

  if (!authHeader.startsWith("Bearer ") && !authHeader.startsWith("bearer ")) {
    return res.status(401).json({
      status: httpresponser.FAIL,
      error: "Invalid token format",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);

    req.user = verified;

    next();
  } catch (error) {
    return res.status(403).json({
      status: httpresponser.FAIL,
      error: "Invalid token",
    });
  }
};

module.exports = auth;
