const service = require("./auth.service");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { exists, validate } = require("../../models/task.model");
const { response } = require("../../app");
const { send } = require("vite");

// to create a guest user
const createGuest = async (req, res) => {
  try {
    const user = await service.createGuest();

    const guestJWT = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });

    res.status(201).json({
      success: true,
      token: guestJWT,
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

    res.status(201).json({
      success: true,
      token: emailJWT,
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

    const emailJWT = jwt.sign(
      { sub: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.status(201).json({
      success: true,
      token: emailJWT,
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
        error: "User Deosnot exist",
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

    // response sending
    res.status(200).json({
      success: true,
      token: loginJWT,
      message: "User Login JWT Created Successfully",
    });
  } catch (e) {
    res.status(500).json({
      success: false,
      message: e.message,
    });
  }
};

module.exports = {
  createUserEmail,
  createGuest,
  createUserEmailAdmin,
  login,
};
