import React, { useState } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";

interface Message {
  id: number;
  text: string;
  sender: "me" | "other";
}

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Hey there!", sender: "other" },
    { id: 2, text: "Hi! How are you?", sender: "me" }
  ]);

  const handleSend = (message: string) => {
    setMessages((prev) => [...prev, { id: Date.now(), text: message, sender: "me" }]);
  };

  return (
    <div className="flex flex-col h-full border">
      <div className="flex-1 overflow-y-auto p-2 flex flex-col">
        {messages.map((msg) => (
          <MessageBubble key={msg.id} text={msg.text} sender={msg.sender} />
        ))}
      </div>
      <MessageInput onSend={handleSend} />
    </div>
  );
};

export default ChatWindow;
