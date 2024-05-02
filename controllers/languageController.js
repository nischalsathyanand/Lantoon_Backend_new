const Languages=require("../models/course")
//create
const createLanguage=async(req,res)=>
{
    try{
        
     const language=new Languages(req.body);
     await language.save();
     res.status(201).json(language);

    

    }
    catch (error) {
        res.status(400).json({ message: error.message });
      }
    
}


// read
const getLanguageById = async (req, res) => {
    const { languageId } = req.params; 
  
    try {
      const language = await Languages.findById(languageId); 
      if (!language) {
        return res.status(404).json({ message: "Language not found" });
      }
  
      res.status(200).json(language); 
    } catch (error) {
      console.error("Error fetching language:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  };

  // Update a language by ID
  const updateLanguageById = async (req, res) => {
    try {
        const language = await Languages.findByIdAndUpdate(req.params.languageId, req.body, { new: true });
        if (!language) {
          return res.status(404).json({ message: 'Language not found' });
        }
        res.json(language);
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
    
  };
  
  // Delete a language by ID
  const deleteLanguageById = async (req, res) => {
    try {
        const language = await Languages.findByIdAndDelete(req.params.languageId);
        if (!language) {
          return res.status(404).json({ message: 'Language not found' });
        }
        res.json({ message: 'Language deleted successfully' });
      } catch (error) {
        res.status(500).json({ message: error.message});
    }
    
  };
  
module.exports={createLanguage,getLanguageById,updateLanguageById,deleteLanguageById}