const express = require("express");
const router = express.Router();
const UserData = require("../models/UserData");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


// Middleware to authenticate the user
const authenticateUser = async (req, res, next) => {
    const { username, password } = req.body;
  
    try {
      const user = await UserData.findOne({ username });
  
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
  
      // Check if the provided password matches the hashed password in the database
      const isMatch = await bcrypt.compare(password, user.password);
  
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
  
      // If authentication is successful, attach the user to the request object
      req.user = user;
  
      next(); // Move to the next middleware
    } catch (error) {
      console.error("Error authenticating user:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
// Middleware to check the user's role
const checkRole = (requiredRole) => (req, res, next) => {
    const { user } = req;
  
    if (user.role !== requiredRole) {
      return res.status(403).json({ message: "Forbidden: Insufficient role" });
    }
  
    // Attach the role to the request object
    req.role = user.role;
  
    next(); // Move to the next middleware
  };

  // Middleware to generate a JWT token
const generateToken = (req, res, next) => {
    const { username, role } = req.user; 
  
    const token = jwt.sign(
      { username, role }, 
      "some-secret-key",
      { expiresIn: "1h" } 
    );
  
    req.token = token; 
  
    next(); 
  };
  



// Endpoint for user sign-up
router.post("/v1/signup", async (req, res) => {
  const { username, password, role } = req.body;
  console.log(username);

  if (!username || !password || !role) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const existingUser = await UserData.findOne({ username });

    if (existingUser) {
      return res.status(409).json({ message: "Username already exists" });
    }

    
    const saltRounds = 10; 
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = new UserData({
      username,
      password: hashedPassword,
      role,
    });

    await newUser.save();

    res.status(201).json({ message: "User created successfully" }); // Send success response
  } catch (error) {
    console.error("Error creating user:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// Endpoint for user login with middleware
router.post("/v1/login", authenticateUser, generateToken, (req, res) => {
  
    const { token } = req;
    const { username, role } = req.user;
  
    res.status(200).json({
      token,
      userInfo: {
        username,
        role,
      },
    });
  });

module.exports = router;
