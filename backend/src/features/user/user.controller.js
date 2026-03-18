const service = require("./user.service");
const bcrypt = require("bcrypt");

const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

// to create the account for a gurst user
async function addEmail(req, res) {
  try {
    const userId = req.userId;
    const { email, password } = req.body;

    // validate request input
    if (!email || !password) {
      return res.status(400).json({
        error: "Email And Password are required",
      });
    }

    const verifyEmailExistance = await service.getCurrentUser(userId);

    if (verifyEmailExistance.email) {
      return res.status(403).json({
        error: "Email already exists for the user",
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);

    const updatedData = await service.addEmail(userId, email, hashedPass);

    res.status(200).json({
      success: true,
      data: updatedData,
      message: `Email and password added for user ${userId}`,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
}

// to get the user data based on id
async function getCurrentUser(req, res) {
  try {
    const userId = req.userId;

    const currentUser = await service.getCurrentUser(userId);

    res.status(200).json({
      success: true,
      data: currentUser,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
}

// to promote a third party user
async function promote(req, res) {
  try {
    const id = req.params.id;

    // check if user id requested to promote is a admin
    // here getCurrentUser is working as a getUser service as it is getting the details of the user id in the params
    const checkUser = await service.getCurrentUser(id);

    if (!checkUser) {
      return res.status(404).json({
        error: "User Doesnot exist",
      });
    }
    if (checkUser.role === "admin") {
      return res.status(409).json({
        error: "User is alerady a admin",
      });
    }

    // promote logic
    const promoted = await service.updateUserRole(id, "admin");

    res.status(200).json({
      success: true,
      promotedUser: promoted,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
}

// to demote a third party user
async function demote(req, res) {
  try {
    const id = req.params.id;

    // check if user is admin to demote
    const checkUser = await service.getCurrentUser(id);

    if (!checkUser) {
      return res.status(404).json({
        error: "User doesnot exist",
      });
    }
    
    // to verify id user is trying to demote themself
    if (checkUser.id === req.userId) {
      return res.status(403).json({
        error: "Admin Cannot Demote Themselves",
      });
    }

    // to check if user is admin or not 
    if (checkUser.role === "user") {
      return res.status(409).json({
        error: "User is not a admin, so cannot demote",
      });
    }

    const key = req.headers["demote-key"];

    if (key !== process.env.DEMOTE_KEY) {
      return res.status(403).json({
        error: "Invalid demote key",
      });
    }

    const demoted = await service.updateUserRole(id, "user");

    res.status(200).json({
      success: true,
      demotedUser: demoted,
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
}

// to delete a user using user if alog with all tasks 
async function deleteUser(req, res) {
  try {
    const id = req.userId;
    const deletedUser = await service.deleteUser(id);

    if (!deletedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.clearCookie("token", cookieOptions);

    return res.status(200).json({
      success: true,
      message: "User and associated tasks deleted successfully",
    });
  } catch (e) {
    return res.status(500).json({
      success: false,
      message: e.message,
    });
  }
}

module.exports = {
  getCurrentUser,
  addEmail,
  promote,
  demote,
  deleteUser,
};
