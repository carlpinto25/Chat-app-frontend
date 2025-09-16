
import React, { useState } from "react";
import { socket } from "../socket"; 

interface MessageInputProps {
  onSend: (message: string) => void;
  name: string; 
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend, name }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage("");
    
    socket.emit("feedback", { feedback: "" });
  };

  
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
    <div className="flex p-2 border-t dark:bg-[#080a09] border-t-white"> //dark theme changed
      <input
        type="text"
        className="flex-1 p-2 border rounded dark:bg-gray-600 dark:text-white drop-shadow-amber-100 drop-shadow-lg/20"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleSend()}
        
        onFocus={handleTyping}
        onKeyPress={handleTyping}
        onBlur={handleStopTyping}
      />
      <button
        onClick={handleSend}
        className="px-4 bg-blue-500 dark:bg-red-700 text-white rounded-lg ml-2"
      >
        Send
      </button>
    </div>
  );
};

export default MessageInput;