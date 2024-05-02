const express = require("express");
const router = express.Router();

const {
  authenticateUser,
  checkRole,
  generateToken,
  decodeToken,
} = require("../middleware/authMiddleware");

const UserData = require("../models/UserData");
const bcrypt = require("bcrypt");

// Login endpoint
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

// Endpoint for SuperAdmin to add institute admins
router.post("/v1/addInstituteAdmin", decodeToken, async (req, res) => {
  const { role } = req.user;
  const { username, password, instituteKey, instituteName } = req.body;

  if (role !== "superadmin") {
    return res.status(403).json({
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

// Endpoint for Institute Admin to add students
router.post("/v1/addStudent", decodeToken, async (req, res) => {
  const { role, instituteKey, instituteName } = req.user;
  const { username, password } = req.body;

  if (role !== "instituteadmin") {
    return res.status(403).json({
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

// Endpoint for Institute Admin to view student details
router.get("/v1/getstudentdetails", decodeToken, async (req, res) => {
  try {
    const { role, instituteKey: adminInstituteKey } = req.user;
    const { instituteKey } = req.query;

    if (role !== "instituteadmin") {
      return res.status(403).json({
        message: "Unauthorized - Only institute admins can view student details",
      });
    }

    if (!instituteKey || instituteKey !== adminInstituteKey) {
      return res.status(403).json({
        message: "Unauthorized - Invalid institute key",
      });
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
    res.status(500).json({
      message: "Error retrieving student details",
      error,
    });
  }
});

module.exports = router;
