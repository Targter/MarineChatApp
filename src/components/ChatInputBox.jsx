import React, { useCallback, memo, useRef, useEffect } from "react";
import { Send } from "lucide-react";
import {
  useProcessingStore,
  useSidebarStore,
  useTypingStore,
  useStore,
  useUserStore,
} from "../store/useStore";

const ChatInputBox = memo(() => {
  const inputRef = useRef(null); // ✅ Correct ref initialization
  const { addChat } = useSidebarStore();
  const { currentChat, addMessage } = useStore();
  const { getIsProcessing, setIsProcessing } = useProcessingStore();
  const { setTypingComplete } = useTypingStore();
  
  const { subscriptionEndDate } = useUserStore();

  const isProcessing = currentChat ? getIsProcessing(currentChat) : false;
  const parsedSubscriptionDate = new Date(subscriptionEndDate);
  const isSubscriptionExpired =
    !isNaN(parsedSubscriptionDate) && parsedSubscriptionDate < new Date();

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus(); // ✅ Works correctly now
    }
  }, [currentChat]);

  const handleSubscriptionExpiration = useCallback(() => {
    alert("Your subscription has expired. Please renew.");
  }, []);

  const handleSendMessage = useCallback(
    async (e) => {
      e?.preventDefault();

      setIsProcessing(currentChat, true);
      setTypingComplete(currentChat, false);

      if (isSubscriptionExpired) {
        handleSubscriptionExpiration();
        return;
      }

      if (!inputRef.current?.value.trim() || isProcessing) return;

      const message = {
        role: "user",
        content: inputRef.current.value,
      };

      inputRef.current.value = ""; // ✅ Clear input without re-render

      if (!currentChat) {
        console.log("called:");
        const newChatId = await addChat();
        await addMessage(newChatId, message);
      } else {
        await addMessage(currentChat, message);
      }

      setIsProcessing(currentChat, false);

      inputRef.current?.focus();
    },
    [
      currentChat,
      addMessage,
      addChat,
      setIsProcessing,
      setTypingComplete,
      isSubscriptionExpired,
    ]
  );

  return (
    <div className="w-full">
      <form
        action="submit"
        onSubmit={handleSendMessage}
        className="flex space-x-2 w-full"
      >
        <input
          type="text"
          ref={inputRef} // ✅ Correctly assigned to input
          placeholder={
            isProcessing ? "Please wait, processing..." : "Type your message..."
          }
          className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800 bg-[#2f2f2f] md:w-[90%] w-[50px] "
          disabled={isProcessing}
        />
        <button
          onClick={handleSendMessage}
          disabled={isProcessing}
          className="bg-gray-600 text-black p-2 rounded-lg disabled:opacity-50 text-center"
        >
          <Send className="h-5 w-5" />
        </button>
      </form>
    </div>
  );
});

export default ChatInputBox;
