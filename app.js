const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const Language=require("./models/Language")

const mongoose = require("mongoose");
const path = require("path");
const port = 3000;

// MONGO
const uri =
  "mongodb+srv://nischalsathyanand:nischal123@cluster0.06igqyd.mongodb.net/testDB?retryWrites=true&w=majority&appName=Cluster0";
mongoose
  .connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });


  
app.get("/", (req, res) => {
  res.send("Welcome to the Image Server!");
});
app.get("/home",(req,res) =>
{
  res.send("home page");
})

// Endpoint to get all languages
app.get("/api/v1/languages", async (req, res) => {
  try {
    const languages = await Language.find(); // Retrieve all languages from MongoDB
    res.status(200).json(languages); // Send the result as JSON
  } catch (err) {
    console.error("Error retrieving languages:", err);
    res.status(500).json({ error: "An error occurred while retrieving languages" });
  }
});


// for chapters
app.get('/api/v1/chapters', async (req, res) => {
  const { language } = req.query;

  if (!language) {
    return res.status(400).json({ error: 'Language query parameter is required.' });
  }

  try {
    const doc = await Language.findOne({
      [language]: { $exists: true },
    });
console.log(doc)
    if (!doc) {
      console.log(`No data found for language: ${language}`);
      return res.status(404).json({ error: `No data found for language: ${language}` });
    }

    // Use square brackets to dynamically access the correct language data
    const chapterData = doc[language]; 

    console.log(`Retrieved data for ${language}:`, chapterData);

    return res.status(200).json(chapterData);

  } catch (err) {
    console.error('Error retrieving chapters:', err);
    return res.status(500).json({ error: 'An error occurred while retrieving chapters.' });
  }
});



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


