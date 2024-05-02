const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();
const UserData = require("../models/UserData");

const authenticateUser = async (req, res, next) => {
  const { username, password } = req.body;

  try {
    const user = await UserData.findOne({ username });

    if (!user) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid username or password" });
    }

    user.lastLoggedInTime = new Date();
    await user.save();

    req.user = user;
    next();
  } catch (error) {
    console.error("Error authenticating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const checkRole = (req, res, next) => {
  const { user } = req;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const role = user.role;

  if (!role) {
    return res.status(403).json({ message: "Role not assigned" });
  }

  req.role = role;
  next();
};

const generateToken = (req, res, next) => {
  try {
    const { user } = req;

    const payload = {
      username: user.username,
      role: user.role,
      instituteName: user.instituteName,
      instituteKey: user.instituteKey,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET_KEY, {
      expiresIn: "1h",
    });

    req.token = token;
    next();
  } catch (error) {
    res.status(500).json({ message: "Token generation error", error });
  }
};

const decodeToken = (req, res, next) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ message: "No token provided" });
  }

  const jwtToken = token.split(" ")[1];

  jwt.verify(jwtToken, process.env.JWT_SECRET_KEY, (err, decoded) => {
    if (err) {
      return res.status(401).json({ message: "Invalid token" });
    }

    req.user = decoded;
    next();
  });
};

module.exports = {
  authenticateUser,
  checkRole,
  generateToken,
  decodeToken,
};
