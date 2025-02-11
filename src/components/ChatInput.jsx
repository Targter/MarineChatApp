import React, { useCallback, useEffect, useState, memo, useMemo } from "react";
import { Mic } from "lucide-react";
import { useStore, useProcessingStore, useUIStore } from "../store/useStore";
import "regenerator-runtime/runtime";
import SpeechRecognition, {
  useSpeechRecognition,
} from "react-speech-recognition";
import ChatInputBox from "./ChatInputBox";

const InputBox = memo(ChatInputBox);

const ChatInput = memo(() => {
  const { currentChat, addMessage } = useStore();
  const { getIsProcessing, setIsProcessing } = useProcessingStore();
  const { chatStarted } = useUIStore();
  const [isRecording, setIsRecording] = useState(false);

  const { transcript, resetTranscript, browserSupportsSpeechRecognition } =
    useSpeechRecognition();

  const isProcessing = useMemo(
    () => (currentChat ? getIsProcessing(currentChat) : false),
    [currentChat, getIsProcessing]
  );

  useEffect(() => {
    if (currentChat) {
      resetTranscript();
    }
  }, [currentChat, resetTranscript]);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      SpeechRecognition.stopListening();
    } else {
      SpeechRecognition.startListening({ continuous: true, language: "en-US" });
    }
    setIsRecording((prev) => !prev);
  }, [isRecording]);

  const processAudio = useCallback(async () => {
    if (!transcript || !currentChat) return;

    setIsProcessing(currentChat, true);

    try {
      await addMessage(currentChat, {
        content: transcript,
        role: "user",
      });

      resetTranscript();
    } catch (error) {
      console.error("Error processing audio:", error);
    } finally {
      setIsProcessing(currentChat, false);
    }
  }, [transcript, currentChat, addMessage, resetTranscript, setIsProcessing]);

  if (!browserSupportsSpeechRecognition) {
    return null;
  }

  const containerClasses = ` p-5 ${
    chatStarted
      ? "flex items-end justify-center p-4 w-full"
      : " w-[80%] flex justify-center"
  }`;

  const inputBoxClasses = `flex space-x-2 bg-[#424242] flex-shrink-0 bg-opacity-75 backdrop-blur-md sm:p-4 p-3 rounded-2xl ${
    chatStarted ? "w-[70%]" : "w-full sm:w-[70%]"
  }`;

  const micButtonClasses = `p-2 rounded-full ${
    isRecording ? "bg-[#2f2f2f] text-red-600" : "bg-[#2f2f2f] text-gray-600"
  }`;

  return (
    <div className={containerClasses}>
      <div className={inputBoxClasses}>
        <button onClick={toggleRecording} className={micButtonClasses}>
          <Mic className="h-5 w-5" />
        </button>
        {transcript && (
          <button
            onClick={processAudio}
            disabled={isProcessing}
            className="bg-green-500 text-white p-2 rounded-lg disabled:opacity-50"
          >
            {isProcessing ? "Processing..." : "Send Audio"}
          </button>
        )}
        <div className="w-full">
          <InputBox />
        </div>
      </div>
    </div>
  );
});

export default ChatInput;
