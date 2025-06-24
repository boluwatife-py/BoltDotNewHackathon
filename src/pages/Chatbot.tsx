import { useLayoutEffect, useRef, useState } from "react";
import HeadInfo from "../components/UI/HeadInfo";
import Assistant, {
  Attachment as AssistantAttachment,
} from "../components/Chat/Assistant";
import UserChat from "../components/Chat/User";
import { useUser } from "../context/UserContext";
import PillImage from "../assets/images/Pill.jpg";
import { Send } from "lucide-react";
import { useChat } from "../hooks/useChat";

export default function Chatbot() {
  const { name, avatarUrl } = useUser();
  const scrollAnchor = useRef<HTMLDivElement>(null);
  const { messages, isTyping, sendMessage, errorType, clearError } = useChat();
  const [userInput, setUserInput] = useState("");

  useLayoutEffect(() => {
    scrollAnchor.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping, errorType]);

  // ✅ Enable send if there's any non-whitespace input — ignore isTyping and error
  const canSend = userInput.trim().length > 0;

  const handleSend = () => {
    if (!canSend) return;
    sendMessage(userInput);
    setUserInput("");
  };

  return (
    <div className="bg-[var(--border-dark)] min-h-[calc(100vh-60px)] flex flex-col">
      <HeadInfo text="SafeDoser Assistant" />

      {/* Chat messages */}
      <div className="flex-1 p-[1rem] overflow-y-auto flex flex-col mb-[3.5rem]">
        {messages.map((msg, idx) =>
          msg.sender === "user" ? (
            <UserChat
              key={idx}
              name={name}
              userAvatar={avatarUrl}
              text={msg.text}
            />
          ) : (
            <Assistant
              key={idx}
              text={msg.text}
              errorType={
                errorType && idx === messages.length - 1 ? errorType : undefined
              }
              onRetry={clearError}
              onLogin={clearError}
            >
              {idx === 2 && (
                <AssistantAttachment
                  link="https://localhost:5173"
                  image={PillImage}
                  text="Heart Health Support"
                  subText="Supports cardiac function"
                />
              )}
            </Assistant>
          )
        )}

        {isTyping && <Assistant isLoading text="" />}
        <div ref={scrollAnchor} />
      </div>

      {/* Input bar */}
      <div className="bg-white px-[1rem] py-[0.75rem] flex items-center justify-center fixed bottom-[3.5rem] w-full">
        <div className="py-[0.5rem] pr-[0.5rem] pl-[1rem] bg-[var(--border-dark)] w-full rounded-[0.75rem] flex items-center justify-between has-focus-within:border has-focus-within:border-[var(--text-primary)] transition-all">
          <input
            type="text"
            placeholder="Ask a question about medications"
            className="py-[0.5rem] text-[0.75rem] placeholder:text-[var(--text-placeholder)] outline-0 font-medium text-[var(--text-primary)] w-full"
            value={userInput}
            onChange={(e) => setUserInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            // ❌ don't disable this input
          />
          <button
            className={`flex items-center justify-center relative h-full py-[0.3rem] right-[.75rem] ${
              canSend ? "cursor-pointer" : "cursor-not-allowed"
            }`}
            onClick={handleSend}
            disabled={!canSend} // ✅ disable *only* the button
          >
            <Send
              className={
                canSend
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-placeholder)]"
              }
            />
          </button>
        </div>
      </div>
    </div>
  );
}
