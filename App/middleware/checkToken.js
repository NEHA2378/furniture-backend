let jwt = require('jsonwebtoken');

let checkToken = (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    //Check if header exists
    if (!authHeader) {
      return res.send({
        _status: false,
        _message: "No Token Provided"
      });
    }

    //Extract token safely
    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.send({
        _status: false,
        _message: "Token missing"
      });
    }

    //Verify token
    const decoded = jwt.verify(token, process.env.TOKENKEY);

    req.userId = decoded.id;

    next();

  } catch (error) {
    console.log("JWT ERROR:", error.message); // 👈 IMPORTANT DEBUG

    return res.send({
      _status: false,
      _message: "Invalid Token"
    });
  }
};

module.exports = { checkToken };