import React, { useEffect, useState } from "react";
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { socket } from "../socket"; // Import the socket instance

interface Message {
  id: number;
  text: string;
  sender: string;
  dateTime: string;
}

const ChatWindow: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [clientsTotal, setClientsTotal] = useState(0);
  const [name] = useState("Anonymous"); // could make this editable

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Connected to server:", socket.id);
    });

    socket.on("clients-total", (count: number) => {
      setClientsTotal(count);
    });

    socket.on("chat-message", (data: any) => {
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

    return () => {
      socket.off("connect");
      socket.off("clients-total");
      socket.off("chat-message");
    };
  }, []);

  const handleSend = (message: string) => {
    const data = {
      name,
      message,
      dateTime: new Date(),
    };

    socket.emit("message", data);

    setMessages((prev) => [
      ...prev,
      { id: Date.now(), text: message, sender: name, dateTime: new Date().toISOString() },
    ]);
  };

  return (
    <div className="flex flex-col h-full border">
      <div className="p-2 text-sm text-gray-500 border-b">
        Connected Clients: {clientsTotal}
      </div>
      <div className="flex-1 overflow-y-auto p-2 flex flex-col">
        {messages.map((msg) => (
          <MessageBubble
            key={msg.id}
            text={msg.text}
            sender={msg.sender === name ? "me" : "other"}
          />
        ))}
      </div>
      <MessageInput onSend={handleSend} />
    </div>
  );
};

export default ChatWindow;