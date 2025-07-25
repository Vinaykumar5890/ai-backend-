const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const axios = require('axios');

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

app.post('/ask', async (req, res) => {
  const { prompt } = req.body;

  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: "gpt-3.5-turbo", // FREE model
        messages:  [
    {
    role: "system",
    content: "You are a helpful, intelligent AI assistant named Nova. You provide clear, detailed answers to any questions."
   },
  {
    role: "user",
    content: prompt
  }
], 
        max_tokens: 1000,
        temperature: 0.7,
        top_p: 1,
        n: 1,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': 'http://localhost:3000', // ✅ your app link or domain
          'X-Title': 'My-AI-Assistant' // any name
        }
      }
    );

    res.json({ reply: response.data.choices[0].message.content });
  } catch (err) {
    console.error("OpenRouter error:", err.response?.data || err.message);
    res.status(500).json({ error: "Failed to get response from OpenRouter." });
  }
});

app.listen(5000, () => console.log("🚀 Server running on port 5000"));
