import { VscLayoutSidebarLeft } from "react-icons/vsc";
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";

const App: React.FC = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [name, setName] = useState("");

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const firstChar = name ? name.charAt(0).toUpperCase() : "";

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#161618] overflow-y-auto">
      <Sidebar isOpen={isSidebarOpen} firstChar={firstChar} />

      <div className="flex-1 flex flex-col">
        <div className="p-2 bg-white dark:bg-[#1B1B1F]">
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-gray-200 dark:bg-white transition duration-100 ease-in-out cursor-pointer"
            title="Toggle Sidebar"
          >
            <VscLayoutSidebarLeft size={18} />
          </button>
        </div>

        <div className="flex-1">
          <ChatWindow name={name} setName={setName} />
        </div>
      </div>
    </div>
  );
};

export default App;
