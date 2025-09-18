import React, { useEffect, useState, useRef } from "react"; // ✅ added useRef
import MessageBubble from "./MessageBubble";
import MessageInput from "./MessageInput";
import { socket } from "../socket";
import ExportChat from "./ExportChat";

const messageTone = new Audio("/message-tone.mp3");

interface Message {
  id: number;
  text: string;
  sender: string;
  dateTime: string;
}

interface SocketMessagePayload {
  name: string;
  message: string;
  dateTime: string;
}

interface FeedbackPayload {
  feedback: string;
}

interface ChatWindowProps {
  name: string;
  setName: React.Dispatch<React.SetStateAction<string>>;
}

const ChatWindow: React.FC<ChatWindowProps> = ({ name, setName }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [clientsTotal, setClientsTotal] = useState(0);
  const [feedback, setFeedback] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null); // ✅ added
  const [fullHistory, setFullHistory] = useState<Message[]>([]); // ✅ added

  useEffect(() => {
    fetch("/api/socket")
      .then(() => {
        console.log("Socket.io backend initialized");

        socket.on("connect", () => {
          console.log("Connected to server:", socket.id);
        });

        socket.on("clients-total", (count: number) => {
          setClientsTotal(count);
        });

        socket.on("chat-message", (data: SocketMessagePayload) => {
          messageTone.play().catch((error) =>
            console.error("Error playing sound:", error)
          );

          const incomingMessage: Message = {
            id: Date.now(),
            text: data.message,
            sender: data.name,
            dateTime: data.dateTime,
          };

          setMessages((prev) => [...prev, incomingMessage]);
          setFullHistory((prev) => [...prev, incomingMessage]);
        });


        socket.on("feedback", (data: FeedbackPayload) => {
          setFeedback(data.feedback);
        });
      })
      .catch((err) =>
        console.error("Error initializing Socket.io backend:", err)
      );

    return () => {
      socket.off("connect");
      socket.off("clients-total");
      socket.off("chat-message");
      socket.off("feedback");
    };
  }, []);

    setTimeout(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, 100);


  // ✅ auto-scroll to bottom when messages update
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }

    
  }, [messages]);

  const handleSend = (message: string) => {
    messageTone.play().catch((error) =>
      console.error("Error playing sound:", error)
    );

    const data = {
      name,
      message,
      dateTime: new Date().toISOString(),
    };

    socket.emit("message", data);

    const outgoingMessage: Message = {
      id: Date.now(),
      text: message,
      sender: name,
      dateTime: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, outgoingMessage]);
    setFullHistory((prev) => [...prev, outgoingMessage]);
  };

  return (
    <div className="flex flex-col h-[93.5vh] max-sm:h-[93dvh] "> {/* ✅ added height + border */}
      <div className="p-2 text-sm text-gray-500 border-b border-b-gray-300 dark:text-amber-50 bg-[#F6F6F7] dark:bg-[#3A3A3A]"> {/* ✅ dark mode */}
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            <span>
              Clients:{" "}
              {clientsTotal === 0 ? "Starting server..." : clientsTotal}
            </span>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Your name"
              className="px-2 border border-black rounded max-sm:w-1/3 dark:border-white dark:bg-[#1B1B1F]"
            />
          </div>
          <ExportChat
            currentMessages={messages}
            fullHistory={fullHistory}
            chatTitle="General Chat"
          />
        </div>
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
        <div ref={messagesEndRef} /> {/* ✅ auto-scroll anchor */}
      </div>
      <MessageInput onSend={handleSend} name={name} />
    </div>
  );
};

export default ChatWindow;
