import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";

export type Message = {
  sender: "user" | "assistant";
  text: string;
};

export type ErrorType = "network" | "server" | "auth" | undefined;

const API_BASE_URL = 'http://localhost:8000';

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

        const response = await fetch(`${API_BASE_URL}/chat/history`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.messages && data.messages.length > 0) {
            setMessages(data.messages);
          } else {
            // Default welcome message
            setMessages([{
              sender: "assistant",
              text: `Hey ${user?.name || 'there'}! 👋 I'm your personal medical AI assistant powered by advanced AI. I can help you with questions about your medications, supplements, drug interactions, side effects, and general health concerns. What would you like to know? 💊✨`
            }]);
          }
        } else {
          // Default welcome message on error
          setMessages([{
            sender: "assistant",
            text: `Hey ${user?.name || 'there'}! 👋 I'm your personal medical AI assistant. Ask me any questions about your medications, supplements, or health concerns! 💊✨`
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

      const response = await fetch(`${API_BASE_URL}/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        if (response.status === 401) {
          setErrorType("auth");
        } else if (response.status >= 500) {
          setErrorType("server");
        } else {
          setErrorType("network");
        }
        throw new Error(`Error ${response.status}`);
      }

      const data = await response.json();
      const assistantMessage: Message = { sender: "assistant", text: data.reply };
      setMessages((prev) => [...prev, assistantMessage]);
      setLastUserMessage(null);
    } catch (error) {
      console.error("Chat error:", error);
      if (!errorType) setErrorType("network");
      
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
        await fetch(`${API_BASE_URL}/chat/clear`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
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