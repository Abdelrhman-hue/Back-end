const httpresponser = require("../utils/httpjsend");

module.exports = (...roles) => {
  return (req, res, next) => {
    if (!req.user || !req.user.roles) {
      return res
        .status(403)
        .json({ status: httpresponser.FAIL, error: "Access denied" });
    }

    const hasRole = req.user.roles.some((role) => roles.includes(role));
    if (!hasRole) {
      return res
        .status(403)
        .json({ status: httpresponser.FAIL, error: "Access denied" });
    }

    next();
  };
};
