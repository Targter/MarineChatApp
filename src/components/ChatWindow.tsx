
import ChatText from "./ChatText";
import ChatInput from "./ChatInput"
import React,{ memo } from "react";
import { useSidebarStore } from "../store/useStore";

const ChatTextBox = memo(ChatText)
const ChatInputBox = memo(ChatInput)

export function ChatWindow() {  
  
  const { isSidebarOpen } = useSidebarStore();
  return (
    <div 
    className={`flex flex-col h-[calc(100vh-4rem)] max-h-screen transition-all duration-300 
    ${isSidebarOpen ? "w-[75%] sm:w-[80%] items-center" : "w-full items-center"}  `}
  >
      <ChatTextBox key="chat-text"/>
      <ChatInputBox key="chat-input"/>
    </div>

  );
}

