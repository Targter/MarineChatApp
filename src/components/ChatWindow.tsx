import  { useEffect, useState } from 'react';
import { Mic, Send, User } from 'lucide-react';
import { useStore } from '../store/useStore';
import 'regenerator-runtime/runtime';

import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';
export function ChatWindow() {
  const { chats, currentChat, user, addMessage } = useStore();
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);


  // 
 
  const { transcript, resetTranscript,browserSupportsSpeechRecognition } = useSpeechRecognition();


  if (!browserSupportsSpeechRecognition) {
    console.log("Speech recognition not supported");
    return null;
  }
  const currentChatData = chats.find((chat) => chat.id === currentChat);
  const messages = currentChatData?.messages || [];

  const handleSend = () => {
    if (!input.trim() || !currentChat) return;

    addMessage(currentChat, {
      content: input,
      role: 'user',
    });

    // Simulate AI response
   

    setInput('');
  };

  // const toggleRecording = () => {
  //   setIsRecording(!isRecording);
  //   // Implement voice recording logic here
  // };

  useEffect(() => {
    // Reset transcript when switching to a new chat
    if (currentChat) {
      resetTranscript();
    }
  }, [currentChat, resetTranscript]);

 

  const toggleRecording = () => {
    if (isRecording) {
      SpeechRecognition.stopListening();
      setIsRecording(false);
    } else {
      SpeechRecognition.startListening({ continuous: true, language: 'en-US' });
      setIsRecording(true);
    }
  };

 
  const processAudio = async () => {
    if (!transcript || !currentChat) return;

    setIsProcessing(true);
    try {
      // Add transcribed text as a user message
      await addMessage(currentChat, {
        content: transcript,
        role: 'user',
      });

      // Send the transcribed message to the chat API to get the assistant's response
      // const apiResponse = await axios.get(
      //   `https://flask-api-three-mu.vercel.app/stream/${transcript}`
      // );

      // await addMessage(currentChat, {
      //   content: apiResponse.data.response ,
      //   role: 'assistant',
      // });

      resetTranscript();
    } catch (error) {
      console.error('Error processing audio:', error);
    } finally {
      setIsProcessing(false);
    }
  };


  //
  const displayedMessages = user.isPremium
    ? messages
    : messages.slice(-10);

  if (!currentChat) {
    return (
      <div className="flex-1 flex items-center md:justify-center justify-start bg-red-50 over">
        <p className="text-white md:text-lg text-sm mt-3">Select or create a chat to get started</p>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-4rem)] ">
      <div className="flex-1 md:overflow-y-auto overflow-hidden md:p-4 p-0 space-y-4   ">
        {!user.isPremium && messages.length > 10 && (
          <div className="text-center py-2 bg-[#424242] text-indigo-50 rounded-lg">
            Upgrade to premium to see your full chat history
          </div>
        )}
        {displayedMessages.map((message) => (
          <div
            key={message.id}
            className={`flex ${
              message.role === 'user' ? 'justify-end' : 'justify-start'
            } p-3`}
          >
           {/* userIcon */}
            {message.role !== 'user' && (
      <div className="flex items-center space-x-2">
        {/* Icon for assistant */}
        <User className="h-6 w-6 text-gray-400" />
      </div>
    )}
            <div
              className={`max-w-[70%] rounded-lg md:p-3 p-2 ${
                message.role === 'user'
                  ? ' text-[#ECECEC] bg-[#2f2f2f]'
                  : ' text-[#ECECEC] '
              }`}
            >
              {message.content}
            </div>
          </div>
        ))}
      </div>
      <div className="p-4  ">
        <div className="flex space-x-2">
          <button
            onClick={toggleRecording}
            className={`p-2 rounded-full ${
              isRecording
                ? 'bg-[#2f2f2f] text-red-600'
                : 'bg-[#2f2f2f] text-gray-600'
            }`}
          >
            <Mic className="h-5 w-5" />
          </button>
          {/*  */}
          {transcript && (
            <button
              onClick={processAudio}
              disabled={isProcessing}
              className="bg-green-500 text-white p-2 rounded-lg disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : 'Send Audio'}
            </button>
          )}

          {/*  */}
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message..."
            className="flex-1 border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-gray-800 bg-[#2f2f2f] w-full "
          />
          <button
            onClick={handleSend}
            disabled={!input.trim()}
            className="bg-white text-black p-2 rounded-lg disabled:opacity-50"
          >
            <Send className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
}