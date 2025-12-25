const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const OpenAI = require('openai');

const app = express();
const PORT = process.env.PORT || 3000;

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

app.use(cors());
app.use(bodyParser.json());
app.use(express.static('public'));


app.post('/generate', async (req, res) => {
    const { idea } = req.body;

    if (!idea) return res.status(400).json({ error: "Website idea is required." });

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-5-nano",
            messages: [
                {
                    role: "system",
                    content: "You are a helpful website architect. For every user prompt describing a website idea, even if simple or non-technical, respond with: 1) a friendly, personalized greeting acknowledging the idea, 2) a structured blueprint covering purpose/goals, main entities/components, must-have features, pages/views, user flow and error handling, optional enhancements, and content/photography guidance if relevant, 3) a concise, copy-ready summary at the end. Keep responses complete but contained, avoiding excessive explanations or repetition. Your goal is to anticipate what the user might not have considered, so they receive a full, actionable prompt for building their website. And please just make a 2-3 sentences for each point, we do not want to overwhelm the user with all these details, they can build on top of your prompt by asking for more details. It would be great to highlight/style each point with an emoji or something just to make the answer more organized and understandable"
                },
                { role: "user", content: `Hi, ${idea}` }
            ]
        });

        res.json({ output: response.choices[0].message.content });
        console.log(response);

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to generate blueprint." });
    }
});

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});