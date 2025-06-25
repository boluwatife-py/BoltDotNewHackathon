import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary-light)] to-[var(--border-dark)] flex flex-col items-center justify-center px-4 py-8">
      {/* Animated Character - Reduced Size */}
      <div className="relative mb-6">
        {/* Main Character - Pill with Face */}
        <div className="relative">
          {/* Pill Body - Smaller */}
          <div className="w-24 h-16 bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-dark)] rounded-full flex items-center justify-center shadow-lg animate-bounce-gentle">
            {/* Pill Split Line */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-0.5 bg-white/30"></div>
            </div>
            
            {/* Face */}
            <div className="relative z-10 flex items-center justify-center">
              {/* Eyes - Smaller */}
              <div className="flex gap-2 mb-1">
                <div className="w-2 h-2 bg-white rounded-full animate-blink">
                  <div className="w-1 h-1 bg-[var(--primary-dark)] rounded-full mt-0.5 ml-0.5"></div>
                </div>
                <div className="w-2 h-2 bg-white rounded-full animate-blink-delayed">
                  <div className="w-1 h-1 bg-[var(--primary-dark)] rounded-full mt-0.5 ml-0.5"></div>
                </div>
              </div>
            </div>
            
            {/* Mouth - Smaller */}
            <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2">
              <div className="w-3 h-1.5 border-2 border-white rounded-b-full animate-mouth"></div>
            </div>
          </div>
          
          {/* Arms - Smaller */}
          <div className="absolute top-1/2 -left-4 transform -translate-y-1/2">
            <div className="w-6 h-1.5 bg-[var(--primary-color)] rounded-full rotate-12 animate-wave-left"></div>
          </div>
          <div className="absolute top-1/2 -right-4 transform -translate-y-1/2">
            <div className="w-6 h-1.5 bg-[var(--primary-color)] rounded-full -rotate-12 animate-wave-right"></div>
          </div>
        </div>
        
        {/* Floating Particles - Smaller */}
        <div className="absolute -top-3 -left-3 w-1.5 h-1.5 bg-[var(--primary-color)] rounded-full animate-float-1"></div>
        <div className="absolute -top-2 -right-4 w-1 h-1 bg-[var(--primary-dark)] rounded-full animate-float-2"></div>
        <div className="absolute -bottom-2 -left-1 w-1 h-1 bg-[var(--primary-color)] rounded-full animate-float-3"></div>
        <div className="absolute -bottom-3 -right-3 w-1.5 h-1.5 bg-[var(--primary-dark)] rounded-full animate-float-1"></div>
      </div>

      {/* 404 Text - Mobile Optimized */}
      <div className="text-center mb-6">
        <h1 className="text-5xl sm:text-6xl md:text-8xl font-bold text-[var(--primary-color)] mb-3 animate-pulse-slow">
          4<span className="inline-block animate-spin-slow">0</span>4
        </h1>
        <h2 className="text-lg sm:text-xl md:text-2xl font-bold text-[var(--text-primary)] mb-2">
          Oops! Page Not Found
        </h2>
        <p className="text-[var(--text-secondary)] text-sm sm:text-base max-w-xs sm:max-w-md mx-auto leading-relaxed px-2">
          Looks like this page took the wrong dose and disappeared! 
          Don't worry, our friendly pill is here to help you get back on track.
        </p>
      </div>

      {/* Action Buttons - Mobile Optimized */}
      <div className="flex flex-col gap-3 w-full max-w-xs px-4">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 px-4 py-3 bg-[var(--primary-color)] text-white rounded-xl font-medium hover:bg-[var(--primary-dark)] transition-all duration-300 transform hover:scale-105 shadow-lg text-sm"
        >
          <Home size={18} />
          Go Home
        </Link>
        
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-2 px-4 py-3 border-2 border-[var(--primary-color)] text-[var(--primary-color)] rounded-xl font-medium hover:bg-[var(--primary-color)] hover:text-white transition-all duration-300 transform hover:scale-105 text-sm"
        >
          <ArrowLeft size={18} />
          Go Back
        </button>
      </div>

      {/* Fun Facts - Mobile Optimized */}
      <div className="mt-8 text-center px-4">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-4 shadow-lg max-w-xs mx-auto">
          <h3 className="text-base font-semibold text-[var(--text-primary)] mb-2">
            💊 Did You Know?
          </h3>
          <p className="text-[var(--text-secondary)] text-xs leading-relaxed">
            SafeDoser helps you never miss a dose! Our smart reminders and tracking 
            keep your health routine on point, unlike this lost page! 😄
          </p>
        </div>
      </div>

      {/* Background Decoration - Smaller for Mobile */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-6 w-2 h-2 bg-[var(--primary-color)]/20 rounded-full animate-float-slow"></div>
        <div className="absolute top-32 right-8 w-3 h-3 bg-[var(--primary-dark)]/20 rounded-full animate-float-slow-delayed"></div>
        <div className="absolute bottom-32 left-8 w-2 h-2 bg-[var(--primary-color)]/20 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-24 right-6 w-3 h-3 bg-[var(--primary-dark)]/20 rounded-full animate-float-slow-delayed"></div>
      </div>
    </div>
  );
};

export default NotFound;