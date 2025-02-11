
import ChatText from "./ChatText";
import ChatInput from "./ChatInput"
import React,{ memo } from "react";

const ChatTextBox = memo(ChatText)
const ChatInputBox = memo(ChatInput)
export function ChatWindow() {  
  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] max-h-screen items-center ">
      <ChatTextBox key="chat-text"/>
      <ChatInputBox key="chat-input"/>
    </div>

  );
}
