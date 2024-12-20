import React from 'react';
import { Edit2, Trash2, MessageSquare, Plus } from 'lucide-react';
import { useStore } from '../store/useStore';
import { PremiumBanner } from './PremiumBanner';
export function Sidebar({ isOpen }) {
  const { chats, currentChat, setCurrentChat, deleteChat, updateChatTitle ,addChat } = useStore();

  const handleEditTitle = (chatId: string, currentTitle: string) => {
    const newTitle = prompt('Enter new chat title:', currentTitle);
    if (newTitle && newTitle.trim()) {
      updateChatTitle(chatId, newTitle.trim());
    }
  };

  return (
    <div className={`lg:w-64 md:w-44 w-28 bg-[#171717]  max:h-[calc(100vh-4rem)]  border-r overflow-y-auto ${
      isOpen ? 'block' : 'hidden'
    } `}>
    <div className='w-full flex justify-center p-2 h-auto'>  
      <button
              onClick={addChat}
              className="sm:inline-flex  
               items-center block px-6 py-2 border border-transparent sm:text-lg text-sm font-medium rounded-md text-[#ECECEC]  hover:bg-[#2f2f2f] "
            >
              <Plus className="sm:h-5 sm:w-5 sm:mr-2 text-sm" />
              <span className='sm:block hidden'>New Chat</span>
            </button></div>
            <div className="p-1 flex flex-col h-[88%] justify-between">
        <div className="space-y-2">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`flex items-center justify-between p-2 rounded-lg cursor-pointer ${
                currentChat === chat.id
                  ? ' hover:bg-[#2f2f2f] text-white'
                  : ' text-white hover:bg-[#2f2f2f]'
              }`}
              onClick={() => setCurrentChat(chat.id)}
            >
              <div className="flex items-center space-x-2 flex-1 min-w-0">
                <MessageSquare className="h-5 w-5 sm:block hidden" />
                <span className="truncate">{chat.title}</span>
              </div>
              <div className="flex space-x-1">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEditTitle(chat.id, chat.title);
                  }}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Edit2 className="h-4 w-4" />
                </button>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteChat(chat.id);
                  }}
                  className="p-1 hover:bg-gray-200 rounded"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div><PremiumBanner /></div>
      </div>
    </div>
  );
}