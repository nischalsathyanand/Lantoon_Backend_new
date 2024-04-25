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
    const languages = await Language.find(); 
    const languageNames = [];

    languages.forEach(lang => {
      
      Object.keys(lang.toObject()).forEach(key => {
        if (key !== "_id" && !languageNames.includes(key)) {
          languageNames.push(key); 
        }
      });
    });

    res.status(200).json(languageNames); 
  } catch (err) {
    console.error("Error retrieving languages:", err);
    res.status(500).json({ error: "An error occurred while retrieving languages" });
  }
});

// chapters

app.get("/api/v1/chapters", async (req, res) => {
  const { language } = req.query; 

  if (!language) {
    return res.status(400).json({ error: "Language query parameter is required" });
  }

  try {
    const languages = await Language.find(); 
    let chapters = [];

    languages.forEach(lang => {
      const languageObject = lang.toObject();

      if (languageObject[language]) {
        const languageData = languageObject[language];

       
        const chapterKeys = Object.keys(languageData).filter(key => key.startsWith("chapter_")); 

        chapterKeys.forEach(chapterKey => {
          const chapter = languageData[chapterKey]; 
          chapters.push({ key: chapterKey, id: chapter._id });
        });
      }
    });

    if (chapters.length > 0) {
      res.status(200).json({ language, chapters }); 
    } else {
      res.status(404).json({ error: `No chapters found for language: ${language}` }); 
    }
  } catch (err) {
    console.error("Error retrieving chapters:", err);
    res.status(500).json({ error: "An error occurred while retrieving chapters" });
  }
});



app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});


