import { useEffect, useState, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { chatAPI } from "../config/api";

export type Message = {
  sender: "user" | "assistant";
  text: string;
};

export type ErrorType = "network" | "server" | "auth" | undefined;

// Key for storing chat history in localStorage
const CHAT_HISTORY_STORAGE_KEY = "safedoser_chat_history";

export function useChat() {
  const { user, isAuthenticated } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [errorType, setErrorType] = useState<ErrorType>(undefined);
  const [lastUserMessage, setLastUserMessage] = useState<string | null>(null);
  const [hasLoadedHistory, setHasLoadedHistory] = useState(false);
  const isLoadingRef = useRef(false);
  const isMountedRef = useRef(true);

  // Track component mount status
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  // Load chat history on mount
  useEffect(() => {
    const loadChatHistory = async () => {
      if (!isAuthenticated || isLoadingRef.current) {
        setHasLoadedHistory(true);
        return;
      }

      isLoadingRef.current = true;

      try {
        // First try to load from localStorage
        if (user) {
          const storageKey = `${CHAT_HISTORY_STORAGE_KEY}_${user.id}`;
          const storedHistory = localStorage.getItem(storageKey);
          
          if (storedHistory) {
            try {
              const parsedHistory = JSON.parse(storedHistory);
              if (Array.isArray(parsedHistory) && parsedHistory.length > 0) {
                if (isMountedRef.current) {
                  setMessages(parsedHistory);
                  setHasLoadedHistory(true);
                  isLoadingRef.current = false;
                  return; // Exit early if we loaded from localStorage
                }
              }
            } catch (e) {
            }
          }
        }

        // If no valid localStorage data, fetch from API
        const token = localStorage.getItem('access_token');
        
        if (!token) {
          if (isMountedRef.current) {
            setHasLoadedHistory(true);
          }
          return;
        }

        const { data } = await chatAPI.getHistory(token);
        
        if (data.messages && data.messages.length > 0) {
          // Transform backend messages to frontend format
          const transformedMessages: Message[] = data.messages.map((msg: any) => ({
            sender: msg.sender,
            text: msg.message
          }));
          
          if (isMountedRef.current) {
            setMessages(transformedMessages);
            
            // Save to localStorage for future visits
            if (user) {
              const storageKey = `${CHAT_HISTORY_STORAGE_KEY}_${user.id}`;
              localStorage.setItem(storageKey, JSON.stringify(transformedMessages));
            }
          }
        } else {
          // Default welcome message
          const welcomeMessage = {
            sender: "assistant" as const,
            text: `Hey ${user?.name || 'there'}! 👋 I'm your personal medical AI assistant powered by advanced AI. I can help you with questions about your medications, supplements, drug interactions, side effects, and general health concerns. What would you like to know? 💊✨`
          };
          
          if (isMountedRef.current) {
            setMessages([welcomeMessage]);
            
            // Save welcome message to localStorage
            if (user) {
              const storageKey = `${CHAT_HISTORY_STORAGE_KEY}_${user.id}`;
              localStorage.setItem(storageKey, JSON.stringify([welcomeMessage]));
            }
          }
        }
      } catch (error) {
        
        // Set default welcome message on error
        const welcomeMessage = {
          sender: "assistant" as const,
          text: `Hey ${user?.name || 'there'}! 👋 I'm your personal medical AI assistant. Ask me any questions about your medications, supplements, or health concerns! 💊✨`
        };
        
        if (isMountedRef.current) {
          setMessages([welcomeMessage]);
        }
      } finally {
        if (isMountedRef.current) {
          setHasLoadedHistory(true);
        }
        isLoadingRef.current = false;
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
      
      if (isMountedRef.current) {
        const updatedMessages = [...messages, userMessage, assistantMessage];
        setMessages(updatedMessages);
        setLastUserMessage(null);
        
        // Update localStorage with new messages
        if (user) {
          const storageKey = `${CHAT_HISTORY_STORAGE_KEY}_${user.id}`;
          localStorage.setItem(storageKey, JSON.stringify(updatedMessages));
        }
      }
    } catch (error: any) {
      
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
      
      if (isMountedRef.current) {
        const updatedMessages = [...messages, userMessage, assistantMessage];
        setMessages(updatedMessages);
        
        // Still update localStorage with fallback response
        if (user) {
          const storageKey = `${CHAT_HISTORY_STORAGE_KEY}_${user.id}`;
          localStorage.setItem(storageKey, JSON.stringify(updatedMessages));
        }
      }
    } finally {
      if (isMountedRef.current) {
        setIsTyping(false);
      }
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
      const welcomeMessage = {
        sender: "assistant" as const,
        text: `Hey ${user?.name || 'there'}! 👋 I'm your personal medical AI assistant. Ask me any questions about your medications, supplements, or health concerns! 💊✨`
      };
      
      if (isMountedRef.current) {
        setMessages([welcomeMessage]);
        
        // Update localStorage with cleared history
        if (user) {
          const storageKey = `${CHAT_HISTORY_STORAGE_KEY}_${user.id}`;
          localStorage.setItem(storageKey, JSON.stringify([welcomeMessage]));
        }
      }
    } catch (error) {
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