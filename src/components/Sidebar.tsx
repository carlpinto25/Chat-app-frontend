import React from "react";

const Sidebar: React.FC = () => {
  return (
    <div className="w-60 bg-gray-100 border-r p-4">
      <h2 className="text-lg font-bold mb-4">Chats</h2>
      <ul>
        <li className="p-2 hover:bg-gray-200 rounded cursor-pointer">
          General
        </li>
        <li className="p-2 hover:bg-gray-200 rounded cursor-pointer">
          Support
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;
