import React, { useState, useRef } from "react";
import { io } from "socket.io-client"; 

const socket = io("http://localhost:5000"); // your backend server

const RecorderButton: React.FC = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [messages, setMessages] = useState<{ type: string; content: string }[]>([]);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunks = useRef<Blob[]>([]);

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);

    mediaRecorderRef.current = mediaRecorder;
    audioChunks.current = [];

    mediaRecorder.ondataavailable = (event) => {
      if (event.data.size > 0) audioChunks.current.push(event.data);
    };

    mediaRecorder.onstop = () => {
      const audioBlob = new Blob(audioChunks.current, { type: "audio/webm" });
      const reader = new FileReader();

      // Convert Blob → Base64 (easy for sending over socket)
      reader.onloadend = () => {
        const base64Audio = reader.result as string;
        socket.emit("chatMessage", { type: "audio", content: base64Audio });
      };
      reader.readAsDataURL(audioBlob);
    };

    mediaRecorder.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    mediaRecorderRef.current?.stop();
    setIsRecording(false);
  };

  // Listen for incoming messages
  React.useEffect(() => {
    socket.on("chatMessage", (msg) => {
      setMessages((prev) => [...prev, msg]);
    });
    return () => {
      socket.off("chatMessage");
    };
  }, []);

  return (
    <div className="p-4">
      <button
        onClick={isRecording ? stopRecording : startRecording}
        className={`px-4 py-2 rounded-lg ${isRecording ? "bg-red-500" : "bg-green-500"} text-white`}
      >
        {isRecording ? "Stop Recording" : "Start Recording"}
      </button>

      <div className="mt-4 space-y-2">
        {messages.map((msg, idx) =>
          msg.type === "audio" ? (
            <audio key={idx} controls src={msg.content} />
          ) : (
            <p key={idx}>{msg.content}</p>
          )
        )}
      </div>
    </div>
  );
};

export default RecorderButton;
