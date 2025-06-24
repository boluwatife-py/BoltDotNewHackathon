import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { AlertCircle, RefreshCcw, LogIn } from "lucide-react";

export default function Assistant({
  text,
  children,
  isLoading = false,
  errorType,
  onRetry,
  onLogin,
}: {
  text?: string;
  children?: ReactNode;
  isLoading?: boolean;
  errorType?: "network" | "server" | "auth";
  onRetry?: () => void;
  onLogin?: () => void;
}) {
  return (
    <div className="py-[1rem] flex flex-col gap-[0.25rem] animate-[popin_0.3s_ease-out]">
      <div className="flex flex-col gap-[0.25rem]">
        <span className="font-medium text-[#6B7280] text-[0.875rem] wkf">
          SafeDoser Assistant
        </span>

        {/* Main content */}
        <div className="bg-[#F5F5F5] border border-[#CCC] px-[1rem] py-[0.75rem] rounded-[1.25rem] rounded-tl text-[var(--text-primary)] text-[1.0625rem] leading-snug w-fit max-w-[22.5rem] min-h-[2.5rem] flex flex-col gap-2">
          {isLoading && (
            <div className="flex flex-row gap-2 items-center justify-center">
              <div className="w-2 h-2 rounded-full bg-[var(--primary-color)] animate-bounce"></div>
              <div className="w-2 h-2 rounded-full bg-[var(--primary-color)] animate-bounce [animation-delay:-.3s]"></div>
              <div className="w-2 h-2 rounded-full bg-[var(--primary-color)] animate-bounce [animation-delay:-.5s]"></div>
            </div>
          )}

          {!isLoading && !errorType && text}

          {errorType === "network" && (
            <div className="flex flex-col gap-2 text-red-600">
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Network error. Check your connection.</span>
              </div>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="self-start px-3 py-1 bg-red-100 text-red-600 rounded-md flex items-center gap-1 text-sm hover:bg-red-200"
                >
                  <RefreshCcw className="w-4 h-4" /> Retry
                </button>
              )}
            </div>
          )}

          {errorType === "server" && (
            <div className="flex flex-col gap-2 text-yellow-700">
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Something went wrong on our end. Please try again.</span>
              </div>
              {onRetry && (
                <button
                  onClick={onRetry}
                  className="self-start px-3 py-1 bg-yellow-100 text-yellow-700 rounded-md flex items-center gap-1 text-sm hover:bg-yellow-200"
                >
                  <RefreshCcw className="w-4 h-4" /> Retry
                </button>
              )}
            </div>
          )}

          {errorType === "auth" && (
            <div className="flex flex-col gap-2 text-blue-700">
              <div className="flex items-center gap-2 text-sm">
                <AlertCircle className="w-4 h-4" />
                <span>Your session has expired. Please log in again.</span>
              </div>
              {onLogin && (
                <button
                  onClick={onLogin}
                  className="self-start px-3 py-1 bg-blue-100 text-blue-700 rounded-md flex items-center gap-1 text-sm hover:bg-blue-200"
                >
                  <LogIn className="w-4 h-4" /> Log in
                </button>
              )}
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

export function Attachment({
  link,
  image,
  text,
  subText,
}: {
  link: string;
  image?: string;
  text: string;
  subText?: string;
}) {
  return (
    <div className="bg-white px-[1rem] py-[0.75rem] flex gap-[0.75rem] rounded-[0.75rem] border border-[var(--text-placeholder)] animate-[popin_0.3s_ease-out]">
      {image && (
        <div
          className="w-[4.0625rem] h-[4.0625rem] rounded-[0.25rem] flex items-center justify-center border border-[var(--primary-dark)] bg-center bg-cover"
          style={{ backgroundImage: `url(${image})` }}
        ></div>
      )}
      <div className="flex flex-col items-start gap-[0.5rem] flex-1">
        <h2 className="text-[1.0625rem] font-semibold">{text}</h2>
        {subText && (
          <span className="text-[0.75rem] text-[var(--text-secondary)]">
            {subText}
          </span>
        )}
        <Link
          to={link}
          className="px-[1rem] py-[.75rem] rounded-[0.75rem] bg-[var(--primary-color)] text-white wkf font-medium text-[0.875rem] cursor-pointer"
        >
          <span>Learn more</span>
        </Link>
      </div>
    </div>
  );
}
