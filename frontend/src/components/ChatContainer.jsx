import { useChatStore } from "../store/useChatStore";
import { useEffect, useRef } from "react";
import { useAuthStore } from "../store/useAuthStore";
import ChatHeader from "./ChatHeader";
import MessageInput from "./MessageInput";
import MessageSkeleton from "./skeletons/MessageSkeleton";
import { formatMessageTime, formatDateSeparator } from "../lib/utils";

const ChatContainer = () => {
  const {
    messages,
    getMessages,
    isMessagesLoading,
    selectedUser,
    subscribeToMessages,
    unsubscribeFromMessages,
  } = useChatStore();
  const { authUser } = useAuthStore();
  const messageEndRef = useRef(null);

  useEffect(() => {
    getMessages(selectedUser._id);
    subscribeToMessages();

    return () => {
      unsubscribeFromMessages();
    };
  }, [selectedUser._id, getMessages, subscribeToMessages, unsubscribeFromMessages]);

  useEffect(() => {
    if (messageEndRef.current && messages.length > 0) {
      const behavior = messages.length > 1 ? "auto" : "smooth";
      messageEndRef.current.scrollIntoView({ behavior });
    }
  }, [messages]);

  if (isMessagesLoading) {
    return (
      <div className="flex-1 flex flex-col overflow-auto">
        <ChatHeader />
        <MessageSkeleton />
        <MessageInput receiverId={selectedUser._id} />
      </div>
    );
  }

  const topDate = messages.length > 0 ? formatDateSeparator(messages[0].createdAt) : "";

  return (
    <div className="flex-1 flex flex-col overflow-y-auto relative">
      <ChatHeader />

      {topDate && (
        <div className="text-center text-gray-700 font-medium">
          {topDate}
        </div>
      )}

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message) => (
          <div key={message._id} id={`message-${message._id}`}>
            <div className={`chat ${message.senderId === authUser._id ? "chat-end" : "chat-start"}`} ref={messageEndRef}>
              <div className="chat-image avatar">
                <div className="size-10 rounded-full border">
                  <img
                    src={message.senderId === authUser._id
                      ? authUser.profilePic || "/avatar.png"
                      : selectedUser.profilePic || "/avatar.png"
                    }
                    alt="profile pic"
                  />
                </div>
              </div>
              <div className="chat-header mb-1">
                <time className="text-xs opacity-50 ml-1">
                  {formatMessageTime(message.createdAt)}
                </time>
              </div>
              <div className="chat-bubble flex flex-col">
                {message.image && (
                  <img
                    src={message.image}
                    alt="Attachment"
                    className="sm:max-w-[200px] rounded-md mb-2"
                  />
                )}
                {message.text && <p>{message.text}</p>}
              </div>
            </div>
          </div>
        ))}

        <div ref={messageEndRef}></div>
      </div>

      <MessageInput receiverId={selectedUser._id} />
    </div>
  );
};

export default ChatContainer;