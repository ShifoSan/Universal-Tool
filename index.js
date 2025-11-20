const express = require('express');
const cors = require('cors');
const { GoogleGenerativeAI } = require('@google/generative-ai');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Store active chat sessions in memory (session-only)
const chatSessions = new Map();

app.post('/api/chat', async (req, res) => {
  try {
    const { message, sessionId } = req.body;
    if (!chatSessions.has(sessionId)) {
      const model = genAI.getGenerativeModel({ model: "gemini-pro" });
      const chat = model.startChat({
        systemInstruction: "You are a helpful assistant for the All-in-one Pocket app. Help users understand and use the various tools available..."
      });
      chatSessions.set(sessionId, chat);
    }
    const chat = chatSessions.get(sessionId);
    const result = await chat.sendMessage(message);
    const response = result.response.text();
    res.json({ response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/', (req, res) => {
  res.send('Gemini AI Proxy Server for All-in-one Pocket');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
