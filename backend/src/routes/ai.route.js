import express from "express";
import axios from "axios";
import Message from "../models/message.models.js";
import User from "../models/user.models.js";
const router = express.Router();
// router.post("/", async (req, res) => {
//   try {
//     const { message, userId } = req.body;

//     const history = await Message.find({
//       $or: [
//         { senderId: userId, receiverId: "ai_assistant" },
//         { senderId: "ai_assistant", receiverId: userId }
//       ]
//     })
//       .sort({ createdAt: -1 })
//       .limit(20)
//       .lean();

//   const messages = history.reverse().map(m => ({
//   role: m.senderId === "ai_assistant" ? "assistant" : "user",
//   content: m.text || ""   // ✅ prevents null/undefined
// }));


//     messages.push({ role: "user", content: message });

//     const aiRes = await axios.post(process.env.AI_URL, {
//       messages
//     });

//     const reply = aiRes.data.reply;

// await Message.create({
//   senderId: userId,
//   receiverId: "ai_assistant",
//   text: message
// });

// await Message.create({
//   senderId: "ai_assistant",
//   receiverId: userId,
//   text: reply
// });

//     res.json({ reply });

//   } catch (e) {
//     console.error(e);
//     res.status(500).json({ error: "AI failed" });
//   }
// });



router.post("/", async (req, res) => {
  try {
    const { message, userId } = req.body;

    if (!message || !userId) {
      return res.status(400).json({
        error: "Missing message or userId",
      });
    }

    const history = await Message.find({
      $or: [
        { senderId: userId, receiverId: "ai_assistant" },
        { senderId: "ai_assistant", receiverId: userId },
      ],
    })
      .sort({ createdAt: -1 })
      .limit(20)
      .lean();

    const messages = history
      .reverse()

      .filter((m) => m.text)

      .map((m) => ({
        role: m.senderId === "ai_assistant" ? "assistant" : "user",

  
        content: String(m.text ?? ""),
      }));

    // ✅ Add latest user message
    messages.push({
      role: "user",
      content: String(message),
    });

    // ✅ Call FastAPI AI service
    const aiRes = await axios.post(process.env.AI_URL, {
      messages,
    });

    // ✅ Safe reply extraction
    const reply =
      aiRes.data?.reply || "Sorry, I couldn't generate a response.";

    // ✅ Save USER → AI
    await Message.create({
      senderId: userId,
      receiverId: "ai_assistant",
      text: message,
    });

    // ✅ Save AI → USER
    await Message.create({
      senderId: "ai_assistant",
      receiverId: userId,
      text: reply,
    });

    // ✅ Send response to frontend
    res.json({ reply });

  } catch (e) {
    console.error("🔥 Backend AI Error:");

    // ✅ Detailed FastAPI / Axios error logging
    if (e.response) {
      console.error("Status:", e.response.status);
      console.error("Data:", e.response.data);
    } else {
      console.error(e.message);
    }

    res.status(500).json({
      error: "AI failed",
    });
  }
});

router.get("/user", async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (e) {
    console.error("AI users error", e);
    res.status(500).json({ error: "failed" });
  }
});


export default router;