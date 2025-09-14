import React from "react";
import ThemeToggle from "./Themetoggle";
interface SidebarProps {
  isOpen: boolean;
}
const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (

    <div
      className={`bg-gray-100 dark:bg-slate-700 dark:text-white border-r p-4 transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? "w-60 max-sm:w-30" : "w-0 p-0"
      }`}
    >

      <div
        className={`transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        <div className="flex flex-row max-sm:flex-col gap-25 max-sm:gap-2">
        <h2 className="text-lg font-bold mb-4 whitespace-nowrap">Chats</h2>
        <ThemeToggle/>
        </div>
        <ul>
          <li className="p-2 hover:bg-gray-200 rounded cursor-pointer whitespace-nowrap">
            General
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
