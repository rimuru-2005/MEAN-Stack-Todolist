const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.token;
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Token not-found",
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.userId = decoded.sub;

    next();
  } catch (e) {
      return res.status(401).json({
          success: false,
          message: "Invalid or expired token",
          error: e
    });
  }
}



module.exports = authMiddleware;
