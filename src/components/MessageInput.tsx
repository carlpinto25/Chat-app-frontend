import React, { useState } from "react";
import { socket } from "../socket";
import AudioRecorder from "./AudioRecorder";


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
  const uploadAudio = async (blob: Blob) => {
  const formData = new FormData();
  formData.append('audio', blob, 'recording.webm');

  try {
    const response = await fetch('http://localhost:5000/upload-audio', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();
    console.log('Upload success', data);
  } catch (error) {
    console.error('Upload failed', error);
 }
};

  return (
    <div className="flex p-2 border-t dark:bg-[#080a09] border-t-white">
      <AudioRecorder onRecordingComplete={uploadAudio}/>
      <input
        type="text"
        className="flex-1 p-2 border ml-2 mt-12 h-1/2 rounded dark:bg-gray-600 dark:text-white drop-shadow-amber-100 drop-shadow-lg/20"

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
        className="px-4 bg-blue-500 text-white rounded dark:bg-red-700 ml-2 h-1/2 mt-12"
      >
        Send
      </button>
    </div>
   
  );
};

export default MessageInput;
