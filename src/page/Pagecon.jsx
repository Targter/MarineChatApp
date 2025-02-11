import React, { memo, useEffect } from "react";
import { ChatWindow } from "../components/ChatWindow";
import { Sidebar } from "../components/Sidebar";
import { Navbar } from "../components/Navbar";
import { useSidebarStore } from "../store/useStore";
import UpgradeToPremium from "../components/UpgradeToPremium";
// import axios from 'axios';
import withAuthCheck from "../Wrapper/AuthApp";
// import { useNavigate } from 'react-router-dom';
const MemoizedNavbar = memo(Navbar);
const MemoizedSidebar = memo(Sidebar);
const MemoizedChatWindow = memo(ChatWindow);

//
const Pagecon = () => {
  // const useNavigatee = useNavigate()
  const { isSidebarOpen } = useSidebarStore();
  return (
    <div className="min-h-screen bg-[#212121] text-white flex md:justify-center justify-end overflow-hidden">
      {/* <Navbar toggleSidebar={toggleSidebar} /> */}
      <MemoizedNavbar />
      <div className="pt-16 flex w-full overflow-x-hidden">
        {isSidebarOpen && <MemoizedSidebar className="w-2/4 min-w-[500px]" />}
        <MemoizedChatWindow />
      </div>
      <UpgradeToPremium />
    </div>
  );
};

export default withAuthCheck(Pagecon);
