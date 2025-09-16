import React from "react";

interface SidebarProps {
  isOpen: boolean;
}
const Sidebar: React.FC<SidebarProps> = ({ isOpen }) => {
  return (

    <div
      className={`bg-gray-100 dark:bg-slate-700 dark:text-white border-r  overflow-y-auto transition-all duration-300 ease-in-out overflow-hidden ${isOpen ? "w-60 max-sm:w-30" : "w-0 p-0"
        }`}
    >

      <div
        className={`transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0"
          }`}
      >
        <div className="flex flex-row max-sm:flex-col gap-25 max-sm:gap-2">
          <h2 className="text-lg font-bold mb-4 whitespace-nowrap px-4">Chats</h2>
        </div>
        <ul className="px-5">
          <li className="p-2 hover:bg-gray-200 rounded cursor-pointer whitespace-nowrap max-sm:-ml-2.5">
            General
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Sidebar;
