import React, { useEffect, useState, useRef } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { socket } from "../socket";

const messageTone = new Audio("/message-tone.mp3");

interface Message {
  id: number;
  text: string;
  sender: string;
  dateTime: string;
}

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [clientsTotal, setClientsTotal] = useState(0);
  const [name, setName] = useState("Anonymous");
  const [feedback, setFeedback] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 🔑 Kickstart backend
    fetch("/api/socket")
      .then(() => {
        console.log("Socket.io backend initialized");

        socket.on("connect", () => {
          console.log("Connected to server:", socket.id);
        });

        socket.on("clients-total", (count: number) => {
          setClientsTotal(count);
        });

        socket.on("chat-message", (data: any) => {
          messageTone.play().catch((error) => console.error("Error playing sound:", error));

          setMessages((prev) => [
            ...prev,
            {
              id: Date.now(),
              text: data.message,
              sender: data.name,
              dateTime: data.dateTime,
            },
          ]);
        });

        socket.on("feedback", (data: any) => {
          setFeedback(data.feedback);
        });
      })
      .catch((err) => console.error("Error initializing Socket.io backend:", err));

    return () => {
      socket.off("connect");
      socket.off("clients-total");
      socket.off("chat-message");
      socket.off("feedback");
    };
  }, []);

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  const handleSend = (message: string) => {
    messageTone.play().catch((error) => console.error("Error playing sound:", error));

    const data = {
      name,
      message,
      dateTime: new Date(),
    };

    socket.emit("message", data);

    setMessages((prev) => [
      ...prev,
      {
        id: Date.now(),
        text: message,
        sender: name,
        dateTime: new Date().toISOString(),
      },
    ]);
  };

  return (
    <div className="flex flex-col h-[93vh] border">
      <div className="p-2 text-sm text-gray-500 dark:text-amber-50 bg-gray-100 dark:bg-slate-700 border-b flex justify-between">
        <span>
          Clients:{" "}
          {clientsTotal === 0 ? "Starting server..." : clientsTotal}
        </span>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          className="px-2 border rounded max-sm:w-1/3"
        />
      </div>
      <div className="flex-1 overflow-y-auto p-2 flex flex-col">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            text={msg.text}
            senderName={msg.sender}
            dateTime={msg.dateTime}
            senderSide={msg.sender === name ? "me" : "other"}
          />
        ))}
        {feedback && (
          <div className="text-gray-500 text-sm p-1">{feedback}</div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <MessageInput onSend={handleSend} name={name} />
    </div>
  );
};

export default ChatWindow;
