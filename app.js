const express = require("express");
const mongoose = require("mongoose");
const app = express();



const port = 3000;
app.use(express.json()); // To parse JSON bodies

// MongoDB Connection

const uri =
  "mongodb+srv://nischalsathyanand:nischal123@cluster0.06igqyd.mongodb.net/testDB?retryWrites=true&w=majority&appName=Cluster0";
// Remember to secure this information
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));






//router
let api = require("./router/api");
app.use("/api", api);
let user = require("./router/user");
app.use("/user", user);
// Start the Express server
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
