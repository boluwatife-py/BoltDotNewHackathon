import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { chatAPI } from "../config/api";

export type Message = {
  sender: "user" | "assistant";
  text: string;
};

export type ErrorType = "network" | "server" | "auth" | undefined;

export function useChat() {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [errorType, setErrorType] = useState<ErrorType>(undefined);
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);

  // Load chat history on mount
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!isAuthenticated) {
        setHasLoadedHistory(true);
        return;
      }

      try {
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          setHasLoadedHistory(true);
          return;
        }

        const { data } = await chatAPI.getHistory(token);
        
        if (data.messages && data.messages.length > 0) {
          // Transform backend messages to frontend format
          const transformedMessages: Message[] = data.messages.map((msg: any) => ({
            sender: msg.sender,
            text: msg.message
          }));
          setMessages(transformedMessages);
        } else {
          // Default welcome message
          setMessages([{
            sender: "assistant",
            text: `Hey ${user?.name || 'there'}! 👋 I'm your personal medical AI assistant powered by advanced AI. I can help you with questions about your medications, supplements, drug interactions, side effects, and general health concerns. What would you like to know? 💊✨`
          }]);
        }
      } catch (error) {
        console.error("Error loading chat history:", error);
        setMessages([{
          sender: "assistant",
          text: `Hey ${user?.name || 'there'}! 👋 I'm your personal medical AI assistant. Ask me any questions about your medications, supplements, or health concerns! 💊✨`
        }]);
      } finally {
        setHasLoadedHistory(true);
      }
    };

    loadChatHistory();
  }, [user, isAuthenticated]);

  const sendMessage = async (message: string) => {
    if (!message.trim() || !isAuthenticated) return;
    
    setErrorType(undefined);
    setLastUserMessage(message);
    
    const userMessage: Message = { sender: "user", text: message };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        setErrorType("auth");
        throw new Error("No authentication token");
      }

      const { data } = await chatAPI.sendMessage(token, message);
      
      const assistantMessage: Message = { sender: "assistant", text: data.reply };
      setMessages((prev) => [...prev, assistantMessage]);
      setLastUserMessage(null);
    } catch (error: any) {
      console.error("Chat error:", error);
      
      if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
        setErrorType("auth");
      } else if (error.message?.includes('500') || error.message?.includes('server')) {
        setErrorType("server");
      } else {
        setErrorType("network");
      }
      
      // Fallback response
      const fallbackResponse = generateFallbackResponse(message);
      const assistantMessage: Message = { sender: "assistant", text: fallbackResponse };
      setMessages((prev) => [...prev, assistantMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  // Generate fallback responses when backend is unavailable
  const generateFallbackResponse = (userMessage: string) => {
    const lowerMessage = userMessage.toLowerCase();
    
    // General medical topics
    if (lowerMessage.includes('interaction') || lowerMessage.includes('side effect')) {
      return `I'm having trouble connecting to my medical database right now, but drug interactions and side effects are important topics! I recommend checking with your pharmacist or healthcare provider for specific information. You can also use reliable sources like drugs.com or consult your medication guides. I'll be back online soon! ⚕️`;
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

  const clearChatHistory = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (token) {
        await chatAPI.clearHistory(token);
      }
      
      // Reset to welcome message
      setMessages([{
        sender: "assistant",
        text: `Hey ${user?.name || 'there'}! 👋 I'm your personal medical AI assistant. Ask me any questions about your medications, supplements, or health concerns! 💊✨`
      }]);
    } catch (error) {
      console.error("Error clearing chat history:", error);
    }
  };

  return {
    messages,
    isTyping,
    sendMessage,
    errorType,
    clearError: clearErrorAndRetry,
    hasLoadedHistory,
    clearChatHistory,
  };
}