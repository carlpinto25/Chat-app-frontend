
import React from "react";
import dayjs from "dayjs";



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
  return (
    <div
      className={`max-w-xs p-2 my-1 rounded-lg flex flex-col ${
        senderSide === "me"
          ? "bg-sky-800 dark:bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white self-end dark:"
          : "bg-gray-200 text-black self-start dark:bg-white/90 dark:text-black/80"
      }`}
    >
      <p>{text}</p>
      <span className="text-xs opacity-70 mt-1 text-right">
        
        {senderName} ● {dayjs(dateTime).format("HH:mm DD.MM.YY")}
      </span>
    </div>
  );
};

export default MessageBubble;