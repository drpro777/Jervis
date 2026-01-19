import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import fetch from "node-fetch";
import path from "path";
import { fileURLToPath } from "url";

dotenv.config();

/* ===== FIX FOR __dirname (ES MODULE) ===== */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* ===== APP INIT (🔥 YEH PEHLE AANA ZAROORI HAI) ===== */
const app = express();

/* ===== MIDDLEWARES ===== */
app.use(cors());
app.use(express.json());


app.use(express.static(path.join(__dirname, "../frontend")));

app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});


/* ===== CHAT API ===== */
app.post("/chat", async (req, res) => {
    const userMessage = req.body.message;

    try {
        const response = await fetch(
            "https://api.openai.com/v1/chat/completions",
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${process.env.OPENAI_KEY}`
                },
                body: JSON.stringify({
                    model: "gpt-4o-mini",
                    messages: [
                        {
                            role: "system",
                            content: `
You are JARVIS.
You speak Urdu + English naturally.
You are polite, smart, and helpful.
You were created by Muhammad Ali.
`
                        },
                        { role: "user", content: userMessage }
                    ],
                    max_tokens: 200
                })
            }
        );

        const data = await response.json();

        if (!data.choices) {
            console.error("OpenAI error:", data);
            return res.status(500).json({
                reply: "OpenAI error — check API key or billing"
            });
        }

        res.json({ reply: data.choices[0].message.content });

    } catch (error) {
        console.error(error);
        res.status(500).json({ reply: "Server error" });
    }
});
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend/index.html"));
});

/* ===== START SERVER ===== */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`✅ JARVIS backend running on http://localhost:${PORT}`);
});
