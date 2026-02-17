import mongoose from "mongoose";

const messageSchema = new mongoose.Schema(
  {
    senderId: {
      type: mongoose.Schema.Types.Mixed, // ✅ ObjectId OR string
      required: true,
    },
    receiverId: {
      type: mongoose.Schema.Types.Mixed, // ✅ ObjectId OR string
      required: true,
    },
    text: String,
    image: String,
    isRead: { type: Boolean, default: false },

    deletedFor: {
      type: [mongoose.Schema.Types.ObjectId], // keep ObjectId
      default: [],
    },
  },
  { timestamps: true }
);

const Message =
  mongoose.models.Message ||
  mongoose.model("Message", messageSchema);

export default Message;