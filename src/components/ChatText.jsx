import React, { useState, useEffect, useRef, useMemo } from "react";
import { ReactTyped } from "react-typed";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { User } from "lucide-react";
import {
  useStore,
  useTypingStore,
  useProcessingStore,
  useUIStore,
  useUserStore,
} from "../store/useStore";
import LoadingSpinner from "./LoadingSpinner";

const ChatText = () => {
  const { currentChat, chats, user, isFetching } = useStore((state) => ({
    currentChat: state.currentChat,
    chats: state.chats,
    user: state.user,
    isFetching: state.isFetching,
  }));

  console.log("fetch:", isFetching);
  const { subscriptionType } = useUserStore((state) => ({
    subscriptionType: state.subscriptionType,
  }));
  const setIsProcessing = useProcessingStore((state) => state.setIsProcessing);
  const getIsProcessing = useProcessingStore((state) => state.getIsProcessing);
  // console.log("getisprocessing:", getIsProcessing);
  const isProcessing = getIsProcessing(currentChat);
  const setTypingComplete = useTypingStore((state) => state.setTypingComplete);
  const { chatStarted, setChatStarted } = useUIStore();

  const chatEndRef = useRef(null);

  const currentChatData = useMemo(
    () => chats.find((chat) => chat.id === currentChat),
    [chats, currentChat]
  );

  const messages = useMemo(
    () => currentChatData?.messages || [],
    [currentChatData?.messages]
  );

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (messages.length > 0 && !chatStarted) {
      setChatStarted(true);
    }
  }, [messages.length, chatStarted, setChatStarted]);
  // console.log("user:", user);
  const isPremium =
    subscriptionType === "premium" || subscriptionType === "7-day-premium";
  const displayedMessages = isPremium ? messages : messages.slice(-10);
  const lastMessageIndex = displayedMessages.length - 1;
  const lastMessage = displayedMessages[lastMessageIndex];
  return (
    <>
      {!isPremium && messages.length > 10 && (
        <div className="text-center py-2 bg-[#424242] text-indigo-50 rounded-lg">
          Upgrade to premium to see your full chat history
        </div>
      )}

      {!chatStarted && (
        <div className="h-auto w-full flex flex-col gap-3 justify-center items-center sm:text-2xl text-xl mt-[200px]">
          How can I help you?
        </div>
      )}

      <div
        className={`${
          chatStarted && "h-full"
        } sm:p-5 w-[79%] overflow-hidden overflow-y-auto chat-container  `}
      >
        {displayedMessages.map((message, index) => (
          <div
            key={index}
            className={`flex ${
              message.role === "user" ? "justify-end" : "justify-start"
            } p-3`}
          >
            {message.role !== "user" && (
              <div className="flex items-center space-x-2">
                <User className="h-6 w-6 text-gray-400" />
              </div>
            )}
            <div
              className={`max-w-[100%] rounded-lg md:p-3 p-2 ${
                message.role === "user"
                  ? "text-[#ECECEC] bg-[#2f2f2f]"
                  : "text-[#ECECEC]"
              }`}
            >
              {message.role === "assistant" && index === lastMessageIndex ? (
                <ReactTyped
                  strings={[message.content]}
                  showCursor={false}
                  typeSpeed={5}
                  onComplete={() => {
                    setIsProcessing(currentChat, false);
                    setTypingComplete(currentChat, true);
                  }}
                />
              ) : (
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  rehypePlugins={[rehypeRaw]}
                  className="prose prose-invert"
                >
                  {message.content}
                </ReactMarkdown>
              )}
              {message.images && message.images.length > 0 && (
                <div className="flex flex-wrap mb-4 w-[300px] sm:w-full ">
                  {message.images.map((image, imgIndex) => (
                    <a
                      key={imgIndex}
                      href={image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className=" flex w-auto h-auto max-w-[90%] max-h-[50%] gap-4 p-11 "
                    >
                      <img
                        src={image}
                        alt="Generated content"
                        className=" transition-transform duration-900 ease-in-out hover:scale-110  rounded-lg cursor-pointer w-[200px] "
                      />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
        {isFetching && (
          <div className="flex justify-center mt-4">
            <LoadingSpinner />
            <p className="text-white ml-2">Thinking...</p>
          </div>
        )}
        <div ref={chatEndRef} />
      </div>
    </>
  );
};

export default React.memo(ChatText);
