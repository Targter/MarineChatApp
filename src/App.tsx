import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { ChatWindow } from './components/ChatWindow';
import { PremiumBanner } from './components/PremiumBanner';

import 'regenerator-runtime/runtime';
import { useState } from 'react';
function App() {

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Function to toggle the sidebar
  const toggleSidebar = () => {
    setIsSidebarOpen(prevState => !prevState);
  };
  return (
    <div className="min-h-screen bg-[#212121] text-white flex md:justify-center justify-end overflow-hidden ">
      <Navbar toggleSidebar={toggleSidebar}  />
      <div className="pt-16 flex w-full">
        <Sidebar isOpen={isSidebarOpen}  />
        <ChatWindow />
      </div>
    </div>
  );
}

export default App;