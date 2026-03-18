const service = require("./auth.service");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const isProduction = process.env.NODE_ENV === "production";
const cookieOptions = {
  httpOnly: true,
  secure: isProduction,
  sameSite: isProduction ? "none" : "lax",
  path: "/",
};

const getExistingSessionUser = async (req, res) => {
  const token = req.cookies.token;

  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const existingUser = await service.getUserById(decoded.sub);

    if (!existingUser) {
      res.clearCookie("token", {
        ...cookieOptions,
      });
      return null;
    }

    return existingUser;
  } catch (e) {
    res.clearCookie("token", {
      ...cookieOptions,
    });
    return null;
  }
};

// to create a guest user
const createGuest = async (req, res) => {
  try {
    const existingUser = await getExistingSessionUser(req, res);

    if (existingUser) {
      return res.status(200).json({
        success: true,
        message: "Existing session is still valid",
      });
    }

    const user = await service.createGuest();

    const guestJWT = jwt.sign({ sub: user._id }, process.env.JWT_SECRET, {
      expiresIn: "365d",
    });

    res.cookie("token", guestJWT, {
      maxAge: 365 * 24 * 60 * 60 * 1000,
      ...cookieOptions,
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
    const existingSessionUser = await getExistingSessionUser(req, res);

    if (existingSessionUser) {
      return res.status(409).json({
        success: false,
        message: "User is already authenticated",
      });
    }

    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email and password are required",
      });
    }

    const existingUser = await service.validateUser(email);

    if (existingUser) {
      return res.status(409).json({
        error: "Email already registered",
      });
    }

    const hashedPass = await bcrypt.hash(password, 10);
    const user = await service.createUserEmail(username, email, hashedPass);

    const emailJWT = jwt.sign(
      { sub: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", emailJWT, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      ...cookieOptions,
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

    if (!username || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "Username, email and password are required",
      });
    }

    const existingUser = await service.validateUser(email);

    if (existingUser) {
      return res.status(409).json({
        error: "Email already registered",
      });
    }

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

    res.cookie("token", emailJWTAdmin, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      ...cookieOptions,
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
    const existingSessionUser = await getExistingSessionUser(req, res);

    if (existingSessionUser) {
      return res.status(200).json({
        success: true,
        message: "Existing session is still valid",
      });
    }

    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        error: "Email And Password are required",
      });
    }

    const loginData = await service.validateUser(email);

    if (!loginData) {
      return res.status(404).json({
        error: "User Does not exist",
      });
    }

    const verifyPass = await bcrypt.compare(password, loginData.password);

    if (!verifyPass) {
      return res.status(401).json({
        error: "User emial or password wrong",
      });
    }

    const loginJWT = jwt.sign(
      { sub: loginData._id, email: loginData.email },
      process.env.JWT_SECRET,
      { expiresIn: "7d" },
    );

    res.cookie("token", loginJWT, {
      maxAge: 7 * 24 * 60 * 60 * 1000,
      ...cookieOptions,
    });

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

// to logout user and delete cookie
const logout = (req, res) => {
  res.clearCookie("token", {
    ...cookieOptions,
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
