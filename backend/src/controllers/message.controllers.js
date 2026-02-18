 import User from '../models/user.models.js';
 import Message from '../models/message.models.js';
import cloudinary from '../lib/cloudinary.js';
import { getReceiverSocketId,io } from '../lib/socket.js';
export const getUserForSidebar=async (req,res)=>{
  try {
    const loggedInUserId=req.user.id;
    const filterdUser=await User.find({_id:{$ne:loggedInUserId}}).select("-password");

    return res.status(200).json(filterdUser);
  } catch (error) {
    console.error("error in getUserForSidebar",error.message)
    return res.status(500).json({error:"Internal Server Error"});
  }
};

// export const getMessage=async(req,res)=>{
//     try {
//         const {id:userToChatId}=req.params;
//         const myId=req.user._id;

//         const message=await Message.find({
//             $or:[
//                 {senderId:myId,receiverId:userToChatId},
//                 {senderId:userToChatId,receiverId:myId}
//             ]
//         })
//         return res.status(200).json(message);
//     } catch (error) {
//         console.error("error in getMessage",error.message)
//         return res.status(500).json({error:"Internal Server Error"});
//     }
// };


export const getMessages = async (req, res) => {
  try {
    const myId = req.user._id.toString();
    const userToChatId = req.params.id.toString();

    const messages = await Message.find({
      $and: [
        {
          $or: [
            { senderId: myId, receiverId: userToChatId },
            { senderId: userToChatId, receiverId: myId },
          ],
        },
        {
          $or: [
            { deletedFor: { $exists: false } },
            { deletedFor: { $nin: [req.user._id] } },
          ],
        },
      ],
    }).sort({ createdAt: 1 });

    res.status(200).json(messages);
  } catch (error) {
    console.log("Error in getMessages:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};



// export const sendMessage = async (req, res) => {
//   try {
//     const { text, image } = req.body;
//     const { id: receiverId } = req.params;
//     const senderId = req.user._id;

//     if (receiverId === "ai_assistant") {
//       const aiReply = "Hello 👋 I'm your AI assistant";

//       const aiMessage = new Message({
//         senderId: "ai_assistant",
//         receiverId: senderId,
//         text: aiReply,
//         isRead: true,
//       });

//       await aiMessage.save();
//       return res.status(201).json(aiMessage);
//     }

//     let imageUrl = null;
//     if (image) {
//       const upload = await cloudinary.uploader.upload(image);
//       imageUrl = upload.secure_url;
//     }

//     const newMessage = new Message({
//       senderId,
//       receiverId,
//       text: text || "",
//       image: imageUrl,
//       isRead: false,
//     });

//     await newMessage.save();

//     // ⭐ REAL-TIME EMIT TO RECEIVER
//     // Emit to receiver
// const receiverSocketId = getReceiverSocketId(receiverId);
// if (receiverSocketId) {
//   io.to(receiverSocketId).emit("newMessage", newMessage);
// }

// // Emit to sender
// const senderSocketId = getReceiverSocketId(senderId.toString());
// if (senderSocketId) {
//   io.to(senderSocketId).emit("newMessage", newMessage);
// }

//     res.status(201).json(newMessage);
//   } catch (error) {
//     console.log("Error in sendMessage:", error.message);
//     res.status(500).json({ error: "Internal server error" });
//   }
// };


export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const senderId = req.user._id.toString();
    const receiverId = req.params.id.toString();

    if (receiverId === "ai_assistant") {
      const aiMessage = new Message({
        senderId: "ai_assistant",
        receiverId: senderId,
        text: "Hello 👋 I'm your AI assistant",
        isRead: true,
      });

      await aiMessage.save();
      return res.status(201).json(aiMessage);
    }

    let imageUrl = null;
    if (image) {
      const upload = await cloudinary.uploader.upload(image);
      imageUrl = upload.secure_url;
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      text: text || "",
      image: imageUrl,
      isRead: false,
    });

    await newMessage.save();

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.log("Error in sendMessage:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const markMessagesAsRead = async (req, res) => {
  try {
    const myId = req.user._id;
    const { id: senderId } = req.params;

    await Message.updateMany(
      {
        senderId,
        receiverId: myId,
        isRead: false,
      },
      { $set: { isRead: true } }
    );

    res.status(200).json({ success: true });
  } catch (error) {
    console.log("markMessagesAsRead error:", error.message);
    res.status(500).json({ error: "Internal server error" });
  }
};