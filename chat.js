const { GoogleGenerativeAI } = require("@google/generative-ai");
const express = require('express');
const app = express();
const mongoose = require('mongoose')
const path = require("path") 
const Prompt = require("./models/prompt.js")

app.use(express.static(path.join(__dirname, "public")));
app.set("views",path.join(__dirname,"views"))
app.set("view engine","ejs")
app.use(express.urlencoded({ extended: true }));


const mongooseUrl = 'mongodb://127.0.0.1:27017/prompt_db'
main()
  .then(() =>{
    console.log('data base connected')
  })
  .catch((err)=>{
   console.log(err)
  })

async function main() {
  await mongoose.connect(mongooseUrl);
}


app.get('/', (req, res) =>{
    res.render("home.ejs")
    
})

app.post('/home.ejs', (req, res) => {
  let text = req.body.text;
  console.log(text);

  async function chatGptAi(text) {
    try {
      const API = "AIzaSyBJmOXu8KHZ-1F8X1aSwWtJWVqFTvZwaPo";
      const genAI = new GoogleGenerativeAI(API);
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const prompt = text;
      const result = await model.generateContent(prompt);
      const ans = result.response.text();

      // Save to database
      let simplePrompt = new Prompt({
        Prompt: prompt,
        Answer: ans,
      });
      await simplePrompt.save();

      res.render("result.ejs", { ans, text });
    } catch (error) {
      console.log(error);
      res.status(500).send("An error occurred while generating a response.");
    }
  }

  chatGptAi(text);
});

app.get("/history", async (req, res) => {
  try {
    // Fetch all saved prompts and answers from the database
    const data = await Prompt.find({});
    res.render("history.ejs", { data });
  } catch (e) {
    console.log(e);
    res.status(500).send("An error occurred while fetching history.");
  }
});
 
const port = 3000;
app.listen(port, () => {
  console.log(`App listening on port ${port}`);
  console.log("working")
});