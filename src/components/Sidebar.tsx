import React from "react";
import ThemeToggle from "./Themetoggle"; // ✅ Added import

interface SidebarProps {
  isOpen: boolean;
  firstChar: string;
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, firstChar }) => {
  return (
    <div
      className={`bg-[#F6F6F7] border-r-2 border-r-gray-300 transition-all duration-300 ease-in-out overflow-hidden flex flex-col 
        dark:bg-[#1B1B1F] dark:text-white ${isOpen ? "w-60 max-sm:w-30" : "w-0 p-0"}`} // ✅ Added dark mode + responsive width
    >
      <div
        className={`transition-opacity duration-300 flex flex-col flex-1 ${
          isOpen ? "opacity-100" : "opacity-0"
        }`}
      >
        {/* ✅ Added ThemeToggle + responsive row/col */}
        <div className="flex flex-row max-sm:flex-col gap-25 max-sm:gap-2 py-4">
          <h2 className="text-lg font-semibold mb-2 ml-2 whitespace-nowrap">
            Chats
          </h2>
          <ThemeToggle />
        </div>

        <ul>
          <li className="p-2 hover:bg-gray-200 dark:hover:text-black font-700 whitespace-nowrap transition duration-300 ease-in-out">
            {/* ✅ Added responsive margin */}
            General
          </li>
        </ul>

        <div className="mt-auto flex justify-start p-2">
          <div className="h-12 w-12 rounded-full bg-amber-400 flex items-center justify-center font-bold text-white dark:bg-white dark:text-black">
            {firstChar}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
