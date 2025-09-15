
import React, { useState } from "react";
import Sidebar from "./components/Sidebar";
import ChatWindow from "./components/ChatWindow";


const App: React.FC = () => {
  
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen dark:bg-gray-600 overflow-y-auto ">
      
      <Sidebar isOpen={isSidebarOpen} />

      <div className="flex-1 flex flex-col">
        
        <div className="p-2 border-b bg-white dark:bg-slate-700">
          <button
            onClick={toggleSidebar}
            className="p-1 rounded-md hover:bg-gray-200 dark:bg-white"
            title="Toggle Sidebar"
          >
            
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>

        
        <div className="flex-1">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
};

export default App;