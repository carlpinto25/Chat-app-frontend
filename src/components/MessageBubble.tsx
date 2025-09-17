import React, { useState } from "react";
import dayjs from "dayjs";
import { Copy, Check } from "lucide-react";

interface MessageBubbleProps {
  text: string;
  senderSide: "me" | "other";
  senderName: string;
  dateTime: string;
}

const MessageBubble: React.FC<MessageBubbleProps> = ({
  text,
  senderSide,
  senderName,
  dateTime,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Copy failed:", err);
    }
  };

  return (
    <div
      className={`relative group max-w-xs p-2 pr-7 my-1 rounded-lg flex flex-col ${
        senderSide === "me"
          ? "bg-sky-800 dark:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white self-end"
          : "bg-gray-200 text-black self-start dark:bg-white/90 dark:text-black/80"
      }`}
    >
      
      <button
  onClick={handleCopy}
  className="absolute top-1 right-1 p-1 rounded-md 
             opacity-100 sm:opacity-0 sm:group-hover:opacity-100 
             transition"
>
  {copied ? (
    <Check size={14} className="text-green-400 dark:text-white" />
  ) : (
    <Copy size={14} className="text-gray-400 dark:text-white" />
  )}
</button>

      <p className="whitespace-pre-wrap break-words">{text}</p>

      <span className="text-xs opacity-70 mt-1 text-right">
        {senderName} ● {dayjs(dateTime).format("HH:mm DD.MM.YY")}
      </span>
    </div>
  );
};

export default MessageBubble;
