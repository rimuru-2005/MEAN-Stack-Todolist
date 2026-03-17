const User  = require('../models/user.model')

async function adminOnly(req, res, next) {
  try {
    const user = await User.findById(req.userId);

    if (!user || user.role !== "admin") {
      return res.status(403).json({
        message: "Admin access required",
      });
    }
    // make chages so a guest user cannot be a admin 
    
    next();
  } catch (e) {
    res.status(500).json({
      message: e.message,
    });
  }
}

module.exports = adminOnly
