import React from 'react';
  import { Edit2, Trash2, MessageSquare, Plus } from 'lucide-react';
  import { useSidebarStore,useStore, useUserStore } from '../store/useStore';
  // import { PremiumBanner } from './PremiumBanner';
  import { Link } from 'react-router-dom';
  import { Crown } from 'lucide-react';
import { useEffect } from 'react';
import axios from 'axios';
  export function Sidebar() {
    console.log("sidebar calling")
    const {titles,addChat,updateChatTitle,deleteChat,isSidebarOpen,fetchTitles} = useSidebarStore(); 
    const {currentChat,setCurrentChat,fetchChatHistory} = useStore();
    console.log("currentChat:",currentChat)
    const handleEditTitle =async (chatId: string, currentTitle: string) => {
      const newTitle = prompt('Enter new chat title:', currentTitle);
      // console.log("newtitle",newTitle)
      if (newTitle && newTitle.trim()) {
        const userId = useUserStore.getState().userId;
        updateChatTitle(chatId, newTitle.trim());
         try {
              const response = await axios.put(`${import.meta.env.VITE_BACKEND_URL}/api/updateChatTitle`, 
               { userId: userId, // You can replace this with actual user ID
                chatId,
                newTitle,},{
              withCredentials:true,
              });
        
              // Handle successful response
              console.log(response.data.message);
            } catch (error) {
              console.error('Error updating chat title:', error);
              // Optionally, show an error message to the user
            } 
         
      }
    };
// fetcing the titles
useEffect(() => {
  const fetchData = async () => {
    try {
      await fetchTitles();
    } catch (error) {
      console.error('Error fetching chat titles:', error);
    }
  };
  fetchData();
}, [fetchTitles]);
   
    return (
      <div className={`lg:w-64 md:w-44 min-w-[170px] bg-[#171717]  max-h-[calc(100vh-4rem)]  border-r overflow-y-auto ${
        isSidebarOpen  ? 'block' : 'hidden'
      } flex flex-col items-center`}>
      <div className='w-full flex justify-center p-2 h-auto '>  
        <button
                onClick={addChat}
                className="sm:inline-flex  
                items-center block sm:px-6 px-3 py-2 border border-transparent sm:text-lg text-sm font-medium rounded-md text-[#ECECEC] bg-[#2f2f2f] hover:bg-[#0c0c0c] "
              >
                <Plus className="sm:h-5 sm:w-5 sm:mr-2 text-sm" />
                <span className='sm:block hidden'>New Chat</span>
              </button></div>


              <div></div>
              <div className="p-1 flex flex-col h-[88%] justify-between">
          <div className="space-y-2 flex justify-center flex-col items-center ">
            {titles.map((chat) => (
              <div
                key={chat.id}
                className={`flex items-center justify-between p-2 rounded-lg cursor-pointer
                  ${currentChat === chat.id ? 'bg-[#2f2f2f] text-white' : 'text-white hover:bg-[#2f2f2f]'}
                 w-[90%]
                `}
                onClick={()=>{setCurrentChat(chat.id)
                  fetchChatHistory(chat.id)}
                }
              >
                <div className="flex items-center space-x-2 flex-1 min-w-0 ">
                  <MessageSquare className="h-5 w-5 sm:block hidden" />
                  <span className="truncate">{chat.title}</span>
                </div>
                <div className="flex space-x-1 ">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditTitle(chat.id, chat.title);
                    }}
                    aria-label="Edit chat title"
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Edit2 className="h-4 w-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteChat(chat.id);
                    }}
                      aria-label="Delete chat"
                    className="p-1 hover:bg-gray-200 rounded"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div> 
           <Link to={"/subscription"}> <button
        className="flex items-center md:space-x-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white md:px-4 md:py-2 p-1 rounded-lg shadow-lg hover:from-yellow-500 hover:to-yellow-700 transition-all"
      >
        <Crown className="md:h-5 md:w-5" />
        <span className="text-sm md:text-lg">Upgrade to Premium</span>
      </button></Link></div>
        </div>
      </div>
    );
  }
