const express = require("express");
// import modules from OpenAI
const { Configuration, OpenAIApi } = require("openai");

// config dotenv
require("dotenv").config();

const app = express();
app.use(express.json());

// open ai configuration
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);
const COMPLETIONS_MODEL = "gpt-3.5-turbo";

const port = process.env.PORT || 5000;

const initialMessages = (prompt) => [
  {
    role: "system",
    content:
      "You are MathGPT, a tool that answers math questions with either a simple analogy or a real-world example.",
  },
  {
    role: "user",
    content: `Be creative! Input prompt begins: ${prompt}`,
  },
];

// POST request endpoint
app.post("/ask", async (req, res) => {
  // getting prompt question from request
  const prompt = req.body.prompt;

  try {
    if (prompt == null) {
      throw new Error("Uh oh, no prompt was provided");
    }

    const response = await openai.createChatCompletion({
      model: COMPLETIONS_MODEL,
      messages: initialMessages(prompt),
      n: 1,
    });

    // return the result
    return res.status(200).json({
      success: true,
      message: response.data.choices[0].message.content.trim(),
    });
  } catch (error) {
    console.log(error.message);
  }
});

app.listen(port, () => console.log(`Server is running on port ${port}!!`));
