import React from "react";

interface MessageBubbleProps {
  text: string;
  sender: "me" | "other";
}

const MessageBubble: React.FC<MessageBubbleProps> = ({ text, sender }) => {
  return (
    <div
      className={`max-w-xs p-2 my-1 rounded-lg ${
        sender === "me"
          ? "bg-blue-500 text-white self-end"
          : "bg-gray-200 text-black self-start"
      }`}
    >
      {text}
    </div>
  );
};

export default MessageBubble;
