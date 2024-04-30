const express = require("express");
const router = express.Router();
const UserData = require("../models/UserData");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
dotenv.config();

// middleware for authentication
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

//middleware checkrole

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

//middleware for genarate token

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
// middleware to decode and verify the JWT token
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

// login page
router.post(
  "/v1/login",
  authenticateUser,
  checkRole,
  generateToken,
  (req, res) => {
    const { token } = req;
    const { user } = req;

    res.json({
      token,
      userInfo: {
        username: user.username,
        role: user.role,
        instituteKey: user.instituteKey,
        instituteName: user.instituteName,
      },
    });
  }
);

// Endpoint for SuperAdmin
router.post("/v1/addInstituteAdmin", decodeToken, (req, res) => {
  const { role } = req.user;
  const { username, password, instituteKey, instituteName } = req.body;

  if (role !== "superadmin") {
    return res
      .status(403)
      .json({
        message: "Unauthorized - Only superadmins can add institute admins",
      });
  }

  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: "Error hashing password", err });
    }

    try {
      const newAdmin = await UserData.create({
        username,
        password: hashedPassword,
        role: "instituteadmin",
        instituteKey,
        instituteName,
        lastLoggedInTime: new Date(),
      });

      res.json({
        message: "Institute admin added successfully",
        admin: {
          username: newAdmin.username,
          instituteKey: newAdmin.instituteKey,
          instituteName: newAdmin.instituteName,
        },
      });
    } catch (error) {
      console.error("Error adding institute admin:", error);
      res.status(500).json({ message: "Error adding institute admin", error });
    }
  });
});

// Endpoint for institute Admin add student
router.post("/v1/addStudent", decodeToken, (req, res) => {
  const { role, instituteKey, instituteName } = req.user;

  const { username, password } = req.body;

  if (role !== "instituteadmin") {
    return res
      .status(403)
      .json({
        message: "Unauthorized - Only institute admins can add students",
      });
  }

  bcrypt.hash(password, 10, async (err, hashedPassword) => {
    if (err) {
      return res.status(500).json({ message: "Error hashing password", err });
    }

    try {
      const newStudent = await UserData.create({
        username,
        password: hashedPassword,
        role: "student",
        instituteKey,
        instituteName,
        lastLoggedInTime: new Date(),
      });

      res.json({
        message: "Student added successfully",
        student: {
          username: newStudent.username,
          instituteKey: newStudent.instituteKey,
          instituteName: newStudent.instituteName,
        },
      });
    } catch (error) {
      console.error("Error adding student", error);
      res.status(500).json({ message: "Error adding student", error });
    }
  });
});

// Endpoint for Institute admin for view student details
router.get("/v1/getstudentdetails", decodeToken, async (req, res) => {
  try {
    const { role, instituteKey: adminInstituteKey } = req.user;
    const { instituteKey } = req.query;

    if (role !== "instituteadmin") {
      return res
        .status(403)
        .json({
          message:
            "Unauthorized - Only institute admins can view student details",
        });
    }

    if (!instituteKey || instituteKey !== adminInstituteKey) {
      return res
        .status(403)
        .json({ message: "Unauthorized - Invalid institute key" });
    }

    const students = await UserData.find({ role: "student", instituteKey });

    const studentDetails = students.map((student) => ({
      username: student.username,
      instituteKey: student.instituteKey,
      instituteName: student.instituteName,
      chapterCompleted: student.chaptersCompleted,
    }));

    res.json({
      message: "Student details retrieved successfully",
      studentDetails,
    });
  } catch (error) {
    console.error("Error retrieving student details:", error);
    res
      .status(500)
      .json({ message: "Error retrieving student details", error });
  }
});

module.exports = router;
