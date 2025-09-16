
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";
import ThemeToggle from "./components/Themetoggle";
import { PanelRightClose, PanelRightOpen } from 'lucide-react';


const App: React.FC = () => {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);


  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen dark:bg-gray-600 overflow-y-auto ">

      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col">

        <div className="p-2 border-b bg-white dark:bg-slate-700 flex justify-between">
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-gray-200 hover:cursor-pointer dark:hover:bg-gray-800 dark:text-white"
            title="Toggle Sidebar"
          >
            {isSidebarOpen ? <PanelRightOpen /> : <PanelRightClose />}

          </button>
          <div className="dark:text-white font-bold text-lg">
            AI Chat App
          </div>
          <ThemeToggle/>
        </div>


        <div className="flex-1">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
};

export default App;