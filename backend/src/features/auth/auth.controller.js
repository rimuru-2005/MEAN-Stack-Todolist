const service = require("./auth.service");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

// to set production cookie configuration when deploying
const isProduction = process.env.NODE_ENV === "production";
// to create a guest user
const createGuest = async (req, res) => {
  try {
    const user = await service.createGuest();

    const guestJWT = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });

    // to set cookie in browser bearing the generated jwt token
    res.cookie("token", guestJWT, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 365 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      success: true,
      message: "Guest User Created Successfully",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

// to create a user account with email
const createUserEmail = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    // validating input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email and password are required",
      });
    }

    // check if the user already exists
    const existingUser = await service.validateUser(email);

    if (existingUser) {
      return res.status(409).json({
        error: "Email already registered",
      });
    }

    // the 10 here denotes the number of hasing rounds 10 means 2^10 rounds of hasing
    const hashedPass = await bcrypt.hash(password, 10);

    const user = await service.createUserEmail(username, email, hashedPass);

    const emailJWT = jwt.sign(
      { sub: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // to set cookie in browser bearing the generated jwt token
    res.cookie("token", emailJWT, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(201).json({
      success: true,
      message: "User Account Created",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

// to create admin user
const createUserEmailAdmin = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // validating input
    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email and password are required",
      });
    }

    // check if the user already exists
    const existingUser = await service.validateUser(email);

    if (existingUser) {
      return res.status(409).json({
        error: "Email already registered",
      });
    }

    // the 10 here denotes the number of hasing rounds 10 means 2^10 rounds of hasing
    const hashedPass = await bcrypt.hash(password, 10);

    const user = await service.createUserEmailAdmin(
      username,
      email,
      hashedPass,
    );

    const emailJWTAdmin = jwt.sign(
      { sub: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // to set cookie in browser bearing the generated jwt token
    res.cookie("token", emailJWTAdmin, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });

    res.status(201).json({
      success: true,
      message: "Admin Account Created",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

// to login a user
const login = async (req, res) => {
  try {
    // get user input
    const { email, password } = req.body;

    // input vaildation
    if (!email || !password) {
      return res.status(400).json({
        error: "Email And Password are required",
      });
    }

    // user existance validation
    const loginData = await service.validateUser(email);

    if (!loginData) {
      return res.status(404).json({
        error: "User Does not exist",
      });
    }

    // password vaildation
    const verifyPass = await bcrypt.compare(password, loginData.password);

    if (!verifyPass) {
      return res.status(401).json({
        error: "User emial or password wrong",
      });
    }

    // login jwt creation
    const loginJWT = jwt.sign(
      { sub: loginData._id, email: loginData.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    // to set cookie in browser bearing the generated jwt token
    res.cookie("token", loginJWT, {
      httpOnly: true,
      secure: isProduction,
      sameSite: isProduction ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: "/",
    });
    // response sending
    res.status(200).json({
      success: true,
      message: "User Login JWT Created Successfully",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

// to logut user and delete cookie
const logout = (req, res) => {
  res.clearCookie("token", {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
  });

  res.status(200).json({
    success: true,
    message: "Logged out successfully",
  });
};

module.exports = {
  createUserEmail,
  createGuest,
  createUserEmailAdmin,
  login,
  logout,
};
