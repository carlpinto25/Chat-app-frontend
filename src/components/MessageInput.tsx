// src/components/MessageInput.tsx

import React, { useState } from "react";
import { socket } from "../socket"; // ADDED: Import socket to emit events

interface MessageInputProps {
  onSend: (message: string) => void;
  name: string; // ADDED: Accept the current user's name as a prop
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, name }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage("");
    // ADDED: Clear feedback after sending a message
    socket.emit("feedback", { feedback: "" });
  };

  // ADDED: Handlers for typing feedback
  const handleTyping = () => {
    socket.emit("feedback", {
      feedback: `${name} is typing a message...`,
    });
  };

  const handleStopTyping = () => {
    socket.emit("feedback", {
      feedback: "",
    });
  };

  return (
    <div className="flex p-2 border-t">
      <input
        type="text"
        className="flex-1 p-2 border rounded-l"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        // ADDED: Event handlers for feedback
        onFocus={handleTyping}
        onKeyPress={handleTyping}
        onBlur={handleStopTyping}
      />
      <button
        onClick={handleSend}
        className="px-4 bg-blue-500 text-white rounded-r"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;