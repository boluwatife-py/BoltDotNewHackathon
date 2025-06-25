import { useEffect, useState } from "react";
import { useUser } from "../context/UserContext";
import { useSupplements } from "./useSupplements";

export type Message = {
  sender: "user" | "assistant";
  text: string;
};

export type ErrorType = "network" | "server" | "auth" | undefined;

export function useChat() {
  const { name } = useUser();
  const { supplements } = useSupplements();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [errorType, setErrorType] = useState<ErrorType>(undefined);
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);

  // Load chat history on mount
  useEffect(() => {
    const loadChatHistory = () => {
      try {
        const savedHistory = localStorage.getItem('safedoser-chat-history');
        if (savedHistory) {
          const history = JSON.parse(savedHistory);
          setMessages(history);
        } else {
          // Default welcome message
          setMessages([{
            sender: "assistant",
            text: `Hey ${name}! 👋 I'm your personal medical AI assistant powered by advanced AI. I can help you with questions about your medications, supplements, drug interactions, side effects, and general health concerns. What would you like to know? 💊✨`
          }]);
        }
        setHasLoadedHistory(true);
      } catch (error) {
        console.error("Error loading chat history:", error);
        setMessages([{
          sender: "assistant",
          text: `Hey ${name}! 👋 I'm your personal medical AI assistant. Ask me any questions about your medications, supplements, or health concerns! 💊✨`
        }]);
        setHasLoadedHistory(true);
      }
    };

    loadChatHistory();
  }, [name]);

  // Save chat history whenever messages change
  useEffect(() => {
    if (hasLoadedHistory && messages.length > 0) {
      localStorage.setItem('safedoser-chat-history', JSON.stringify(messages));
    }
  }, [messages, hasLoadedHistory]);

  // Prepare user context for AI
  const getUserContext = () => {
    const userAge = 45; // As requested
    const userSupplements = supplements.map(supp => ({
      name: supp.name,
      time: supp.time,
      tags: supp.tags,
      type: supp.type,
      completed: supp.completed,
      muted: supp.muted,
      alerts: supp.alerts
    }));

    return {
      userName: name,
      userAge,
      supplements: userSupplements,
      currentTime: new Date().toISOString(),
    };
  };

  const sendMessage = async (message: string) => {
    if (!message.trim()) return;
    setErrorType(undefined);
    setLastUserMessage(message);
    
    const userMessage: Message = { sender: "user", text: message };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const userContext = getUserContext();
      
      // Use the Python backend API
      const response = await fetch('http://localhost:8000/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message,
          context: userContext,
          chatHistory: messages.slice(-10) // Send last 10 messages for context
        }),
      });

      if (!response.ok) {
        if (response.status === 401) setErrorType("auth");
        else if (response.status === 503) setErrorType("network");
        else setErrorType("server");
        throw new Error(`Error ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = { sender: "assistant", text: data.reply };
      setMessages((prev) => [...prev, assistantMessage]);
      setLastUserMessage(null);
    } catch (error) {
      console.error("Chat error:", error);
      if (!errorType) setErrorType("network");
      
      // Fallback response with medical context
      const fallbackResponse = generateFallbackResponse(message, supplements);
      const assistantMessage: Message = { sender: "assistant", text: fallbackResponse };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Generate fallback responses with medical context
  const generateFallbackResponse = (userMessage: string, userSupplements: any[]) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // Check if asking about specific supplements
    const mentionedSupplement = userSupplements.find(supp => 
      lowerMessage.includes(supp.name.toLowerCase())
    );
    
    if (mentionedSupplement) {
      return `I see you're asking about ${mentionedSupplement.name}. Based on your current schedule, you take this at ${mentionedSupplement.time}. For specific medical advice about this supplement, please consult with your healthcare provider. I'm currently having trouble connecting to my knowledge base, but I'll be back online soon! 💊`;
    }
    
    // General medical topics
    if (lowerMessage.includes('interaction') || lowerMessage.includes('side effect')) {
      return `Drug interactions and side effects are important topics! I'm currently having trouble accessing my medical database, but I recommend checking with your pharmacist or healthcare provider for specific interaction information. You can also use reliable sources like drugs.com or consult your medication guides. I'll be back online soon! ⚕️`;
    }
    
    if (lowerMessage.includes('dose') || lowerMessage.includes('dosage')) {
      return `Dosage questions are crucial for your safety! I'm currently offline, but please never adjust your medication doses without consulting your healthcare provider first. If you have urgent dosage questions, contact your doctor or pharmacist immediately. I'll be back to help soon! 📋`;
    }
    
    return `I'm having trouble connecting to my medical knowledge base right now, but I'll be back online soon! In the meantime, for urgent medical questions, please contact your healthcare provider. For general medication information, you can also check reliable sources like WebMD or consult your pharmacist. 🔄`;
  };

  const clearErrorAndRetry = () => {
    setErrorType(undefined);
    if (lastUserMessage) {
      sendMessage(lastUserMessage);
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