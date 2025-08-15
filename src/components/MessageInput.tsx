import React, { useState } from "react";

interface MessageInputProps {
  onSend: (message: string) => void;
}

const MessageInput: React.FC<MessageInputProps> = ({ onSend }) => {
  const [message, setMessage] = useState("");

  const handleSend = () => {
    if (!message.trim()) return;
    onSend(message);
    setMessage("");
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
