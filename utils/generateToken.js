const jwt = require("jsonwebtoken");

module.exports = async function (payload) {
  const token = await jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: "15m",
  });
  return token;
};
