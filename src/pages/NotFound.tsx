import React from "react";
import { Link } from "react-router-dom";
import { Home, ArrowLeft } from "lucide-react";

const NotFound: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[var(--primary-light)] to-[var(--border-dark)] flex flex-col items-center justify-center px-4">
      {/* Animated Character */}
      <div className="relative mb-8">
        {/* Main Character - Pill with Face */}
        <div className="relative">
          {/* Pill Body */}
          <div className="w-32 h-20 bg-gradient-to-r from-[var(--primary-color)] to-[var(--primary-dark)] rounded-full flex items-center justify-center shadow-lg animate-bounce-gentle">
            {/* Pill Split Line */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-full h-0.5 bg-white/30"></div>
            </div>
            
            {/* Face */}
            <div className="relative z-10 flex items-center justify-center">
              {/* Eyes */}
              <div className="flex gap-3 mb-2">
                <div className="w-3 h-3 bg-white rounded-full animate-blink">
                  <div className="w-1.5 h-1.5 bg-[var(--primary-dark)] rounded-full mt-0.5 ml-0.5"></div>
                </div>
                <div className="w-3 h-3 bg-white rounded-full animate-blink-delayed">
                  <div className="w-1.5 h-1.5 bg-[var(--primary-dark)] rounded-full mt-0.5 ml-0.5"></div>
                </div>
              </div>
            </div>
            
            {/* Mouth */}
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
              <div className="w-4 h-2 border-2 border-white rounded-b-full animate-mouth"></div>
            </div>
          </div>
          
          {/* Arms */}
          <div className="absolute top-1/2 -left-6 transform -translate-y-1/2">
            <div className="w-8 h-2 bg-[var(--primary-color)] rounded-full rotate-12 animate-wave-left"></div>
          </div>
          <div className="absolute top-1/2 -right-6 transform -translate-y-1/2">
            <div className="w-8 h-2 bg-[var(--primary-color)] rounded-full -rotate-12 animate-wave-right"></div>
          </div>
        </div>
        
        {/* Floating Particles */}
        <div className="absolute -top-4 -left-4 w-2 h-2 bg-[var(--primary-color)] rounded-full animate-float-1"></div>
        <div className="absolute -top-2 -right-6 w-1.5 h-1.5 bg-[var(--primary-dark)] rounded-full animate-float-2"></div>
        <div className="absolute -bottom-3 -left-2 w-1 h-1 bg-[var(--primary-color)] rounded-full animate-float-3"></div>
        <div className="absolute -bottom-4 -right-4 w-2 h-2 bg-[var(--primary-dark)] rounded-full animate-float-1"></div>
      </div>

      {/* 404 Text */}
      <div className="text-center mb-8">
        <h1 className="text-8xl font-bold text-[var(--primary-color)] mb-4 animate-pulse-slow">
          4<span className="inline-block animate-spin-slow">0</span>4
        </h1>
        <h2 className="text-2xl font-bold text-[var(--text-primary)] mb-2">
          Oops! Page Not Found
        </h2>
        <p className="text-[var(--text-secondary)] text-lg max-w-md mx-auto leading-relaxed">
          Looks like this page took the wrong dose and disappeared! 
          Don't worry, our friendly pill is here to help you get back on track.
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
        <Link
          to="/"
          className="flex items-center justify-center gap-2 px-6 py-3 bg-[var(--primary-color)] text-white rounded-xl font-medium hover:bg-[var(--primary-dark)] transition-all duration-300 transform hover:scale-105 shadow-lg"
        >
          <Home size={20} />
          Go Home
        </Link>
        
        <button
          onClick={() => window.history.back()}
          className="flex items-center justify-center gap-2 px-6 py-3 border-2 border-[var(--primary-color)] text-[var(--primary-color)] rounded-xl font-medium hover:bg-[var(--primary-color)] hover:text-white transition-all duration-300 transform hover:scale-105"
        >
          <ArrowLeft size={20} />
          Go Back
        </button>
      </div>

      {/* Fun Facts */}
      <div className="mt-12 text-center">
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg max-w-md mx-auto">
          <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
            💊 Did You Know?
          </h3>
          <p className="text-[var(--text-secondary)] text-sm">
            SafeDoser helps you never miss a dose! Our smart reminders and tracking 
            keep your health routine on point, unlike this lost page! 😄
          </p>
        </div>
      </div>

      {/* Background Decoration */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-4 h-4 bg-[var(--primary-color)]/20 rounded-full animate-float-slow"></div>
        <div className="absolute top-40 right-20 w-6 h-6 bg-[var(--primary-dark)]/20 rounded-full animate-float-slow-delayed"></div>
        <div className="absolute bottom-32 left-20 w-3 h-3 bg-[var(--primary-color)]/20 rounded-full animate-float-slow"></div>
        <div className="absolute bottom-20 right-10 w-5 h-5 bg-[var(--primary-dark)]/20 rounded-full animate-float-slow-delayed"></div>
      </div>
    </div>
  );
};

export default NotFound;