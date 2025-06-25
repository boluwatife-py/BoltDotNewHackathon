import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";

export type Message = {
  sender: "user" | "assistant";
  text: string;
};

export type ErrorType = "network" | "server" | "auth" | undefined;

export function useChat() {
  const { name } = useUser();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [errorType, setErrorType] = useState<ErrorType>(undefined);
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);

  // 🔄 Fetch chat history on load
  useEffect(() => {
    (async () => {
      try {
        const resp = await fetch("http://127.0.0.1:8000/chat-history");
        if (!resp.ok) {
          // If backend is not available, show default welcome message
          setMessages([{
            sender: "assistant",
            text: `Hey ${name}! 👋 I'm your personal medical AI assistant. Ask me any questions about your medications, supplements, or health concerns! 💊✨`
          }]);
          setHasLoadedHistory(true);
          return;
        }
        const history = await resp.json();
        
        // If no history exists, show default welcome message
        if (!history || history.length === 0) {
          setMessages([{
            sender: "assistant",
            text: `Hey ${name}! 👋 I'm your personal medical AI assistant. Ask me any questions about your medications, supplements, or health concerns! 💊✨`
          }]);
        } else {
          setMessages(history);
        }
        setHasLoadedHistory(true);
      } catch (error) {
        console.error("Error loading chat history:", error);
        // Show default welcome message on error
        setMessages([{
          sender: "assistant",
          text: `Hey ${name}! 👋 I'm your personal medical AI assistant. Ask me any questions about your medications, supplements, or health concerns! 💊✨`
        }]);
        setHasLoadedHistory(true);
      }
    })();
  }, [name]);

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
    setErrorType(undefined); // reset errors
    setLastUserMessage(message); // remember this message
    setMessages((prev) => [...prev, { sender: "user", text: message }]);
    setIsTyping(true);

    try {
      const resp = await fetch("http://127.0.0.1:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!resp.ok) {
        if (resp.status === 401) setErrorType("auth");
        else if (resp.status === 503) setErrorType("network");
        else setErrorType("server");
        throw new Error(`Error ${resp.status}`);
      }

      const data = await resp.json();
      setMessages((prev) => [
        ...prev,
        { sender: "assistant", text: data.reply },
      ]);
      setLastUserMessage(null);
    } catch (error) {
      if (!errorType) setErrorType("network");
      setMessages((prev) => [
        ...prev,
        {
          sender: "assistant",
          text: "I'm having trouble connecting right now. Please try again later! 🔄",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  // 🆕 Called when clicking "Retry" on the assistant error state
  const clearErrorAndRetry = () => {
    setErrorType(undefined);
    if (lastUserMessage) {
      sendMessage(lastUserMessage); // re-send the last failed message
    }
  };

  return {
    messages,
    isTyping,
    sendMessage,
    errorType,
    clearError: clearErrorAndRetry,
    hasLoadedHistory,
  };
}