import React, { useState } from "react";
import { socket } from "../socket";
import { BiSend } from "react-icons/bi";

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

    <div className="flex p-2 bg-[#F6F6F7] border-t border-gray-300 dark:border-t-white dark:bg-[#1B1B1F]">
      <input
        type="text"
        className="flex-1 p-2 bg-white/80 border border-gray-500 rounded dark:bg-gray-600 dark:text-white drop-shadow-amber-100 drop-shadow-lg/20"
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
        className="px-4 bg-blue-500 text-white rounded dark:bg-red-700 ml-2"
      >
        <BiSend />
      </button>
    </div>
   
  );
};

export default MessageInput;
