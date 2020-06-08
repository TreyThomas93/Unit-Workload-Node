
module.exports = {
  verifyToken: (req, res, next) => {
    const bearerHeader = req.headers["authorization"];

    if (typeof bearerHeader !== "undefined") {
      const token = bearerHeader.split(" ")[1];

      req.token = token;

      console.log(token);

      next();
    } else {
      // Forbidden
      res.status(403);
    }
  },
};
