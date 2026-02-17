import express from "express";
import axios from "axios";
import Message from "../models/message.models.js";
const router = express.Router();
router.post("/", async (req, res) => {
  try {
    const { message, userId } = req.body;

    // 1️⃣ fetch last 20 messages with AI
    const history = await Message.find({
      $or: [
        { senderId: userId, receiverId: "ai_assistant" },
        { senderId: "ai_assistant", receiverId: userId }
      ]
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    // 2️⃣ convert to OpenAI format
    const messages = history.reverse().map(m => ({
      role: m.senderId === "ai_assistant" ? "assistant" : "user",
      content: m.text
    }));

    // add current message
    messages.push({ role: "user", content: message });

    // 3️⃣ call AI
    const aiRes = await axios.post(process.env.AI_URL, {
      messages
    });

    const reply = aiRes.data.reply;

    // save user message
await Message.create({
  senderId: userId,
  receiverId: "ai_assistant",
  text: message
});

// save AI reply
await Message.create({
  senderId: "ai_assistant",
  receiverId: userId,
  text: reply
});

    res.json({ reply });

  } catch (e) {
    console.error(e);
    res.status(500).json({ error: "AI failed" });
  }
});

export default router;