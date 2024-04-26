const express = require("express");
const app = express();
const Language = require("./models/Language");
const mongoose = require("mongoose");
const port = 3000;

// MongoDB Connection
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

// Basic Endpoints
app.get("/", (req, res) => {
  res.send("Welcome to the Image Server!");
});
app.get("/home", (req, res) => {
  res.send("Home page");
});

// Endpoint to Get All Languages
app.get("/api/v1/languages", async (req, res) => {
  try {
    const languages = await Language.find();
    const languageNames = [];

    languages.forEach((lang) => {
      const keys = Object.keys(lang.toObject());
      keys.forEach((key) => {
        if (key !== "_id" && !languageNames.includes(key)) {
          languageNames.push(key);
        }
      });
    });

    res.status(200).json(languageNames); // Return the language names
  } catch (err) {
    console.error("Error retrieving languages:", err);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving languages" });
  }
});

// Endpoint to Get Chapters for a Language
app.get("/api/v1/chapters", async (req, res) => {
  const { language } = req.query;

  if (!language) {
    return res
      .status(400)
      .json({ error: "Language query parameter is required" });
  }

  try {
    const languages = await Language.find();
    let chapters = [];

    languages.forEach((lang) => {
      const languageObject = lang.toObject();

      if (languageObject[language]) {
        const languageData = languageObject[language];
        const chapterKeys = Object.keys(languageData).filter((key) =>
          key.startsWith("chapter_")
        );

        chapterKeys.forEach((chapterKey) => {
          const chapter = languageData[chapterKey];
          chapters.push({ key: chapterKey, id: chapter._id });
        });
      }
    });

    if (chapters.length > 0) {
      res.status(200).json({ language, chapters });
    } else {
      res
        .status(404)
        .json({ error: `No chapters found for language: ${language}` });
    }
  } catch (err) {
    console.error("Error retrieving chapters:", err);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving chapters" });
  }
});

app.get("/api/v1/lessons", async (req, res) => {
  const { chapter_id } = req.query; 

  if (!chapter_id) {
    return res
      .status(400)
      .json({ error: "Chapter ID query parameter is required" });
  }

  try {
    const languages = await Language.find();
    let lessons = [];

    languages.forEach((lang) => {
      const languageObject = lang.toObject();
      //console.log(languageObject)

      for (const languageKey in languageObject) {
       // console.log(languageKey)
        const languageData = languageObject[languageKey];
       // console.log(languageData)

        if (typeof languageData === "object") {
          for (const chapterKey in languageData) {
            const chapter = languageData[chapterKey];

            console.log(chapter)

            if (chapter._id === chapter_id) {
              const lessonKeys = Object.keys(chapter.lessons);
             // console.log(lessonKeys)

              lessonKeys.forEach((lessonKey) => {
                const lesson = chapter.lessons[lessonKey];
                //console.log(lesson)
                lessons.push({ key: lessonKey, id: lesson._id });
              });

              break;
            }
          }
        }
      }
    });

    if (lessons.length > 0) {
      res.status(200).json({ chapter_id, lessons });
    } else {
      res
        .status(404)
        .json({ error: `No lessons found for chapter ID: ${chapter_id}` });
    }
  } catch (err) {
    console.error("Error retrieving lessons:", err);
    res
      .status(500)
      .json({ error: "An error occurred while retrieving lessons" });
  }
});

// Endpoint to Get Questions for a Specific Lesson


app.get("/api/v1/question", async (req, res) => {
  const { lesson } = req.query;

  if (!lesson) {
    return res.status(400).json({ error: "Lesson ID query parameter is required" });
  }

  try {
    const languages = await Language.find();
    let questions = [];

    
    languages.forEach((lang) => {
      const languageObject = lang.toObject();

      for (const languageKey in languageObject) {
        const languageData = languageObject[languageKey];

        if (typeof languageData === "object") {
          for (const chapterKey in languageData) {
            const chapter = languageData[chapterKey];

            if (chapter.lessons && typeof chapter.lessons === "object") {
              for (const lessonKey in chapter.lessons) {
                const lessonData = chapter.lessons[lessonKey];

                if (lessonData._id === lesson) {
                  
                  questions = lessonData.questions || [];
                  break;
                }
              }
            }
          }
        }
      }
    });

    if (questions.length > 0) {
      res.status(200).json({ lesson, questions });
    } else {
      res.status(404).json({ error: `No questions found for lesson ID: ${lesson}` });
    }
  } catch (err) {
    console.error("Error retrieving questions:", err);
    res.status(500).json({ error: "An error occurred while retrieving questions" });
  }
});


app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
