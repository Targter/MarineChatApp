

import { create } from 'zustand';
import { Chat, Message, User } from '../types';
import axios from 'axios';
import {marked} from "marked"
import { toast } from "react-toastify";



// userData:
interface UserState {
  userId: string | null;
  username: string | null;
  email: string | null;
  subscriptionEndDate: null,
  subscriptionType: string;
  setUserData: (userData: { userId: string; username: string; email: string; subscriptionType: string ,subscriptionEndDate:Date}) => void;
  clearUserData: () => void;
}

// Create a Zustand store
export const useUserStore = create<UserState>((set) => ({
  userId: null,
  username: null,
  subscriptionEndDate:null,
  email: null,
  subscriptionType: null,
  setUserData: (userData) => set({ ...userData }), // Set user data in store
  clearUserData: () => {
    set({ userId: null, username: null, email: null, subscriptionType: null, subscriptionEndDate: null });
    useStore.getState().clearStore();  // ✅ Reset chat store
    useSidebarStore.getState().clearSidebar();  // ✅ Reset sidebar store
    useProcessingStore.getState().clearProcessing();  // ✅ Reset processing states
    useTypingStore.getState().clearTyping();  // ✅ Reset typing states
    useUIStore.getState().clearUI();  // ✅ Reset UI states
  },
}));

interface State {
  chats: Chat[];
 
  currentChat: string | null;
  user: User;
  // image: string | null; // State for the image
  setUser: (user: User) => void;
  // addChat: (chat: Chat) => void; // Action to add a new chat
  setCurrentChat: (id: string | null) => void;
  addMessage: (
    chatId: string,
    message: Omit<Message, 'id' | 'timestamp'>
  ) => Promise<void>;
}

export const useStore = create<State>((set, get) => ({
  chats: [],
  currentChat: null,
  isFetching:false,
  clearStore: () => set({ chats: [], currentChat: null, isFetching: false, isTyping: false }),
  setIsFetching:(value)=>set({isFetching:value}),
  user: {
    id: '1',
    name: 'Abhay Bansal',
    isPremium: false,
  },
  isTyping:false,
  setIsTyping: () => set((state) => ({ isTyping: !state.isTyping })), // ✅ Correct
  setUser: (user) => set({ user }),

  // it initialize the chat with id . 
  createChat: (id: string, title: string) => {
    set((state) => ({
      chats: [...state.chats, { id, title, messages: [] }],
    }));
  },

  setCurrentChat: (id) => set({ currentChat: id }),

  addMessage: async (chatId, message) => {
    const { subscriptionEndDate, subscriptionType, userId } = useUserStore.getState();
    const isSubscriptionExpired = subscriptionEndDate && new Date(subscriptionEndDate) < new Date();
    console.log("calledAddMessage")
    const isTrialUser = subscriptionType === "trial";
    const isPremium = subscriptionType === "premium" || subscriptionType === "7-day-premium";
    const fetchImages = isPremium && !isSubscriptionExpired; // Fetch images only for premium users
  
  
    if ( isSubscriptionExpired) {
      toast.warn("Trial users cannot store chats. Please upgrade your subscription.", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    return 
    }

    const apiUrl =
    subscriptionType === "trial"
      ? import.meta.env.VITE_TRIAL_URL
      : import.meta.env.VITE_PREMIUM_URL;

      set({ isFetching: true });

    set((state) => ({ isTyping: !state.isTyping }));
  
    // Add user message to chat
    const chats = useStore.getState().chats;
  const chat = chats.find((chat) => chat.id === chatId);
  const history = chat
    ? chat.messages.slice(-4).map((msg) => ({
        role: msg.role === "user" ? "user" : "assistant",
        parts: [msg.content],
      }))
    : [];

    set((state) => {
      const chatIndex = state.chats.findIndex((chat) => chat.id === chatId);
      const newChats = [...state.chats];
    
      if (chatIndex === -1) {
        newChats.push({ id: chatId, title: "New Chat", messages: [] });
      }
    
      const chat = newChats.find((chat) => chat.id === chatId);
      chat.messages = [...chat.messages, { 
        id: crypto.randomUUID(), 
        content: message.content, 
        role: "user", 
        timestamp: Date.now() 
      }];
    
      return { chats: newChats };
    });
    try {
      if((subscriptionType === "trial")){
      
      const response = await axios.get(
        `${apiUrl}${message.content}`,
        {
          headers: { "Content-Type": "application/json" },
        }
      );
      console.log("response:",response)
      if (response.status !== 200) {
        set({ isFetching: false });
        console.error("API request failed:", response.status, response.statusText);
        return;
      }

      const assistantMessageContent = response.data; // Set AI response
      let assistantMessageId = crypto.randomUUID();

      // Add assistant message to chat
      set((state) => {
        const chats = [...state.chats];
        const chat = chats.find((chat) => chat.id === chatId);
        if (chat) {
          chat.messages.push({
            id: assistantMessageId,
            content: assistantMessageContent,
            role: "assistant",
            timestamp: Date.now(),
          });
        }
        return { chats };
      });
     }
     else{
      console.log("premium user url")
       console.log("message.content
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          query: message.content,
          history: history,
          top_k: 3,
        }),
      });
  
      if (!response.ok) {
        set({ isFetching: false });
        console.error("API request failed:", response.status, response.statusText);
        return;
      }
  
      const data = await response.json();
      console.log("data:",data)
// Extract text and images from the response
    const assistantMessageContent = data.text; // Get the text content
      const imageUrls = data.images || []; // Get the image URLs (default to an empty array if no images)

// Generate a unique ID for the assistant message
let assistantMessageId = crypto.randomUUID();

// Initialize assistant message in chat
set((state) => {
  const chats = [...state.chats];
  const chat = chats.find((chat) => chat.id === chatId);
  if (chat) {
    chat.messages.push({
      id: assistantMessageId,
      content: marked.parse(assistantMessageContent), // Parse markdown and set content
      role: "assistant",
      timestamp: Date.now(),
      images: imageUrls, // Add all image URLs to the message
    });
  }
  return { chats, isFetching: false }
})
  
      // Store message in database (if not trial/expired)
      if (subscriptionType !== "trial" && !isSubscriptionExpired) {
        const messagesToSend = [
          { role: "user", content: message.content },
          { role: "assistant",  content: assistantMessageContent, 
            ...(imageUrls.length > 0 && { images: imageUrls }) // Only include images if not empty
          },
        ];
  
        await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}api/updateData`,
          { userId, chatId, messages: messagesToSend },
          { withCredentials: true }
        );
      }
     }
    } catch (error) {
      console.error("🚨 Error:", error);
      toast.error("Failed to send message. Please try again.", {
        position: "bottom-right",
        autoClose: 2000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
      set({ isFetching: false });
    }finally{
      set({isFetching:false})
    }
  },
  // FETCH CHAT HISTORY
  fetchChatHistory: async (chatId: string) => {
    const { userId, subscriptionType } = useUserStore.getState();

    // If user is on a trial, show upgrade popup and stop fetching
    if (subscriptionType === "trial") {
      useSubscriptionPopup.getState().setShowUpgradePopup(true); // Show upgrade popup
      return;
    }
      // Ensure the userId exists before proceeding with the request
      if (!userId) {
        console.error("User not authenticated, no userId found.");
        return;
      }
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/chatHistory/${chatId}`, {
        params: { userId},
        withCredentials:true // Replace with the actual user ID
      });

      const chatHistory = response.data.messages;
      set((state) => {
        const chatIndex = state.chats.findIndex((chat) => chat.id === chatId);
        if (chatIndex === -1) {
          state.chats.push({ id: chatId, messages: chatHistory });
        } else {
          state.chats[chatIndex].messages = chatHistory;
        }
        return { chats: [...state.chats] };
      });
    } catch (error) {
      console.error('Error fetching chat history:', error);
    }
  },
}));

interface SidebarState {
  titles: { id: string; title: string }[];
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  addChat: () => Promise<string>;
  deleteChat: (id: string) => void;
  updateChatTitle: (id: string, title: string) => void;
  fetchTitles: () => Promise<void>; // New function to fetch titles
}

export const useSidebarStore = create<SidebarState>((set) => ({
  titles: [],
  isSidebarOpen: false, // Initial state: Sidebar is closed
  clearSidebar: () => set({ titles: [], isSidebarOpen: false }),
  toggleSidebar: () => set((state) => ({ isSidebarOpen: !state.isSidebarOpen })), // Toggle the sidebar state
  fetchTitles: async () => {
    const { userId, subscriptionType } = useUserStore.getState();
  
    if (subscriptionType === "trial") {
      // console.log("fetchTitles")
      useSubscriptionPopup.getState().setShowUpgradePopup(true); // Show upgrade popup
      return;
    }
  
      // Ensure the userId exists before proceeding with the request
      if (!userId) {
        console.error("User not authenticated, no userId found.");
        return;
      }
    try {
      const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}api/titles`, {
        params: { userId }, 
        withCredentials:true,// Replace with the actual user ID
      });
      const reversedTitles = response.data.titles.reverse();

      // Update the state with the reversed titles
      set({ titles: reversedTitles });
    } catch (error) {
      console.error('Error fetching chat titles:', error);
    }
  },
  addChat: async () => {
    // const newChatId = crypto.randomUUID(); 
    // console.log("title add3ed")
    const { subscriptionType ,subscriptionEndDate } = useUserStore.getState();
  const { titles } = useSidebarStore.getState(); // Get the current chat titles

  const isSubscriptionExpired = subscriptionEndDate && new Date(subscriptionEndDate) < new Date();
  
  // Trial users can only have one chat
  if (subscriptionType === "trial" && titles.length >= 1) {
    // console.log("Trial users can only have one chat.");
    useSubscriptionPopup.getState().setShowUpgradePopup(true); // Show upgrade popup
    return; // Prevent further execution
  }

  // Block expired users from creating new chats
  if (isSubscriptionExpired) {
    // console.log("Your subscription has expired. Please upgrade.");
    useSubscriptionPopup.getState().setShowUpgradePopup(true); // Show upgrade popup
    return; // Prevent further execution
  }
    const newChatId = crypto.randomUUID(); // Generate unique ID
    const newChat = {
      id: newChatId,
      title: 'New Chat',
      createdAt: Date.now(),
    };
    
    // Update the local state immediately
    set((state) => ({
      titles: [...state.titles, newChat]
    }));

     // Sync with the chats store
     useStore.getState().createChat(newChatId, newChat.title);

    useStore.getState().setCurrentChat(newChatId);

    return newChatId;
  },

  deleteChat:async (id) => {
    const { subscriptionType, subscriptionEndDate } = useUserStore.getState();

  // Check if the user is a trial user or if their subscription has expired
  const isSubscriptionExpired = subscriptionEndDate && new Date(subscriptionEndDate) < new Date();

  // Block trial and expired users from deleting chats
  if (subscriptionType === "trial" || isSubscriptionExpired) {
    useSubscriptionPopup.getState().setShowUpgradePopup(true); // Show upgrade popup
    return; // Prevent further execution
  }
    set((state) => ({
      titles: state.titles.filter((chat) => chat.id !== id),
    }));
    
    // Remove the chat from useStore
    useStore.setState((state) => ({
      chats: state.chats.filter((chat) => chat.id !== id),
    }));
    const userId = useUserStore.getState().userId;

    // Ensure the userId exists before proceeding with the request
    if (!userId) {
      console.error("User not authenticated, no userId found.");
      return;
    }
    // console.log("delete button called ")
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BACKEND_URL}api/deleteChat`, {
        data: {
          userId, // Replace with actual user ID
          chatId:id,
        },
        withCredentials:true
      });

      // console.log(response.data.message);
    } catch (error) {
      console.error('Error deleting chat:', error);
    }
  },

  updateChatTitle: (id, title) => {
    set((state) => ({
      titles: state.titles.map((chat) =>
        chat.id === id ? { ...chat, title } : chat
      ),
    }));
  
    // Update the chat title in useStore
    useStore.setState((state) => ({
      chats: state.chats.map((chat) =>
        chat.id === id ? { ...chat, title } : chat
      ),
    }));


    
  }

}));

export const useProcessingStore = create((set,get) => ({
  chatsProcessing: {}, // Holds the processing state for each chat by ID

  // Get processing state for a specific chat
  getIsProcessing: (chatId) => {
    const state = get(); // Get the entire store state
    return state.chatsProcessing[chatId] || false; // Return the processing state for a specific chatId
  },
  clearProcessing: () => set({ chatsProcessing: {} }),
  setIsProcessing: (chatId, processing) => set((state) => ({
    chatsProcessing: {
      ...state.chatsProcessing,
      [chatId]: processing,
    },
  })),
}));

export const useTypingStore = create((set) => ({
  chatsTypingComplete: {}, // Holds typing completion state for each chat by ID

  // Get typingComplete state for a specific chat
  getTypingComplete: (chatId) => (chatId) => {
    return set((state) => state.chatsTypingComplete[chatId] || false);
  },clearTyping: () => set({ chatsTypingComplete: {} }),

  // Set typingComplete state for a specific chat
  setTypingComplete: (chatId, typingStatus) => set((state) => ({
    chatsTypingComplete: {
      ...state.chatsTypingComplete,
      [chatId]: typingStatus,
    },

  })),
}));

// for input placeholder
export const useUIStore = create((set) => ({
  chatStarted: false, // Initially false
  setChatStarted: (started) => set({ chatStarted: started }),
  clearUI: () => set({ chatStarted: false }),
}));

export const useSubscriptionPopup = create((set) => ({
  showUpgradePopup: false,
  setShowUpgradePopup: (value) => set({ showUpgradePopup: value }),
}));


