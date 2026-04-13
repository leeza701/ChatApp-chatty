// import { X } from "lucide-react";
// import { useAuthStore } from "../store/useAuthStore";
// import { useChatStore } from "../store/useChatStore";

// const ChatHeader = () => {
//   const { selectedUser, setSelectedUser,clearChat} = useChatStore();
//   const { onlineUsers } = useAuthStore();

//   if (!selectedUser) return null;

//   const isAI = selectedUser._id === "ai_assistant";

//   const avatar = isAI
//     ? "/ai-avatar.png"
//     : selectedUser.profilePic || "/avatar.png";

//   const name = isAI ? "AI Assistant" : selectedUser.fullName || selectedUser.name;

//   const status = isAI
//     ? "AI Assistant"
//     : onlineUsers.includes(selectedUser._id)
//     ? "Online"
//     : "Offline";

//   return (
//     <div className="p-2.5 border-b border-base-300">
//       <div className="flex items-center justify-between">
//         <div className="flex items-center gap-3">
//           {/* Avatar */}
//           <div className="avatar">
//             <div className="size-10 rounded-full relative">
//               <img src={avatar} alt={name} />
//             </div>
//           </div>

//           {/* User info */}
//           <div>
//             <h3 className="font-medium">{name}</h3>
//             <p className="text-sm text-base-content/70">Online</p>
//           </div>
//         </div>

//         {/* Close */}
//         <button onClick={() => setSelectedUser(null)}>
//           <X />
//         </button>
//       </div>
//     </div>
//   );
// };

// export default ChatHeader;








import { X, Trash2 } from "lucide-react";
import { useAuthStore } from "../store/useAuthStore";
import { useChatStore } from "../store/useChatStore";
import { axiosInstance } from "../lib/axios";
import { useAIStore } from "../store/ai.store";

const ChatHeader = () => {
  const { selectedUser, setSelectedUser, clearChat } = useChatStore();
  const { onlineUsers } = useAuthStore();
  const { messages: aiMessages } = useAIStore();

  if (!selectedUser) return null;

  const isAI = selectedUser._id === "ai_assistant";

  const handleDeleteChat = async () => {
    if (isAI) {
      useAIStore.setState({ messages: [] });
      return;
    }

    const confirmDelete = window.confirm(
      "Are you sure you want to delete this chat?"
    );

    if (!confirmDelete) return;

    try {
      await axiosInstance.delete(`/messages/delete/${selectedUser._id}`);
      clearChat(selectedUser._id);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to delete chat");
    }
  };

  return (
    <div className="p-2.5 border-b border-base-300">
      <div className="flex items-center justify-between">
        {/* LEFT */}
        <div className="flex items-center gap-3">
          <div className="avatar">
            <div className="size-10 rounded-full relative">
              <img
                src={
                  isAI
                    ? "/ai.png"
                    : selectedUser.profilePic || "/avatar.png"
                }
                alt={selectedUser.name}
              />
            </div>
          </div>

          <div>
            <h3 className="font-medium">
              {isAI ? "AI Assistant" : selectedUser.name}
            </h3>
            <p className="text-sm text-base-content/70">
              {isAI
                ? "Online"
                : onlineUsers.includes(selectedUser._id)
                ? "Online"
                : "Offline"}
            </p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="flex items-center gap-3">
          <button
            onClick={handleDeleteChat}
            className="text-red-500 hover:bg-red-100 p-2 rounded"
            title="Delete Chat"
          >
            <Trash2 size={18} />
          </button>

          <button
            onClick={() => setSelectedUser(null)}
            className="hover:bg-base-200 p-2 rounded"
            title="Close Chat"
          >
            <X size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatHeader;