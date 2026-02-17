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

export const getMessage=async(req,res)=>{
    try {
        const {id:userToChatId}=req.params;
        const myId=req.user._id;

        const message=await Message.find({
            $or:[
                {senderId:myId,receiverId:userToChatId},
                {senderId:userToChatId,receiverId:myId}
            ]
        })
        return res.status(200).json(message);
    } catch (error) {
        console.error("error in getMessage",error.message)
        return res.status(500).json({error:"Internal Server Error"});
    }
};



export const sendMessage = async (req, res) => {
  try {
    const { text, image } = req.body;
    const { id: receiverId } = req.params;
    const senderId = req.user._id;

    let imageUrl = "";
    if (image && image.startsWith("data:image/")) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    // 1️⃣ Save message
    const newMessage = await Message.create({
      senderId,
      receiverId,
      text,
      image: imageUrl,
    });

    // 2️⃣ Send message to receiver
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    // 3️⃣ Send message to sender (IMPORTANT FIX)
    const senderSocketId = getReceiverSocketId(senderId);
    if (senderSocketId) {
      io.to(senderSocketId).emit("newMessage", newMessage);
    }

    // 4️⃣ Send back clean JSON
    return res.status(201).json(newMessage);

  } catch (error) {
    console.error("error in sendMessage", error.message);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};