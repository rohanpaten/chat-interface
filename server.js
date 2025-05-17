const express = require('express');
const path = require('path');
const { Configuration, OpenAIApi } = require('openai');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname)));
app.use(express.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: message }],
    });
    const reply = completion.data.choices[0].message.content.trim();
    res.json({ reply });
  } catch (err) {
    console.error('OpenAI API error:', err.message);
    res.status(500).json({ error: 'AI service error' });
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
