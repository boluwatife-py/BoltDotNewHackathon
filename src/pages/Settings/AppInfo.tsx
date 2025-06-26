import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Heart, Shield, Zap, Users, Award, ExternalLink } from "lucide-react";

const AppInfo: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--border-dark)]">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b border-[var(--border-grey)]">
        <div className="flex items-center">
          <Link
            to="/settings"
            className="p-2 -ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-[1.5rem] font-bold text-[var(--text-primary)]">App Info</h1>
          </div>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <div className="space-y-6">
          {/* App Logo and Version */}
          <div className="bg-white rounded-xl shadow-sm border border-[var(--border-grey)] p-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-[var(--primary-color)] to-[var(--primary-dark)] rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">💊</span>
            </div>
            <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-2">SafeDoser</h1>
            <p className="text-[var(--text-secondary)] mb-4">Your Personal Medication Companion</p>
            <div className="inline-flex items-center gap-2 bg-[var(--primary-light)] text-[var(--primary-color)] px-4 py-2 rounded-full text-sm font-medium">
              <Award className="w-4 h-4" />
              Version 1.0.1
            </div>
          </div>

          {/* About SafeDoser */}
          <div className="bg-white rounded-xl shadow-sm border border-[var(--border-grey)] p-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Heart className="w-5 h-5 text-[var(--primary-color)]" />
              About SafeDoser
            </h2>
            <p className="text-[var(--text-secondary)] leading-relaxed mb-4">
              SafeDoser is designed to help you manage your medications and supplements safely and effectively. 
              Our mission is to empower individuals to take control of their health through smart medication 
              tracking, AI-powered guidance, and personalized reminders.
            </p>
            <p className="text-[var(--text-secondary)] leading-relaxed">
              Built with care by health technology enthusiasts, SafeDoser combines modern technology with 
              medical best practices to provide you with a comprehensive medication management solution.
            </p>
          </div>

          {/* Key Features */}
          <div className="bg-white rounded-xl shadow-sm border border-[var(--border-grey)] p-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Zap className="w-5 h-5 text-[var(--primary-color)]" />
              Key Features
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[var(--primary-light)] rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[var(--primary-color)] text-sm">📋</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Smart Tracking</h3>
                  <p className="text-[var(--text-secondary)] text-sm">Track medications and supplements with detailed scheduling and dosage information.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[var(--primary-light)] rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[var(--primary-color)] text-sm">🤖</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">AI Assistant</h3>
                  <p className="text-[var(--text-secondary)] text-sm">Get personalized guidance powered by advanced AI technology for medication questions.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[var(--primary-light)] rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[var(--primary-color)] text-sm">⏰</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Smart Reminders</h3>
                  <p className="text-[var(--text-secondary)] text-sm">Never miss a dose with intelligent notifications and scheduling.</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 bg-[var(--primary-light)] rounded-lg flex items-center justify-center flex-shrink-0">
                  <span className="text-[var(--primary-color)] text-sm">🔒</span>
                </div>
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)]">Privacy First</h3>
                  <p className="text-[var(--text-secondary)] text-sm">Your health data is encrypted and protected with industry-standard security.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Technology & Security */}
          <div className="bg-white rounded-xl shadow-sm border border-[var(--border-grey)] p-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Shield className="w-5 h-5 text-[var(--primary-color)]" />
              Technology & Security
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">AI Technology</span>
                <span className="text-[var(--text-primary)] font-medium">Google Gemini AI</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">Data Encryption</span>
                <span className="text-[var(--text-primary)] font-medium">End-to-End</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">Cloud Storage</span>
                <span className="text-[var(--text-primary)] font-medium">Supabase</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">Authentication</span>
                <span className="text-[var(--text-primary)] font-medium">Secure JWT</span>
              </div>
            </div>
          </div>

          {/* Development Info */}
          <div className="bg-white rounded-xl shadow-sm border border-[var(--border-grey)] p-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
              <Users className="w-5 h-5 text-[var(--primary-color)]" />
              Development
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">Release Date</span>
                <span className="text-[var(--text-primary)] font-medium">January 2025</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">Platform</span>
                <span className="text-[var(--text-primary)] font-medium">Web Application</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">Framework</span>
                <span className="text-[var(--text-primary)] font-medium">React + TypeScript</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-[var(--text-secondary)]">Built with</span>
                <span className="text-[var(--text-primary)] font-medium">Bolt.new ⚡</span>
              </div>
            </div>
          </div>

          {/* Legal & Support */}
          <div className="bg-white rounded-xl shadow-sm border border-[var(--border-grey)] p-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-4">Legal & Support</h2>
            <div className="space-y-3">
              <Link
                to="/terms"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--border-dark)] transition-colors"
              >
                <span className="text-[var(--text-primary)]">Terms and Conditions</span>
                <ExternalLink className="w-4 h-4 text-[var(--text-secondary)]" />
              </Link>
              
              <Link
                to="/privacy"
                className="flex items-center justify-between p-3 rounded-lg hover:bg-[var(--border-dark)] transition-colors"
              >
                <span className="text-[var(--text-primary)]">Privacy Policy</span>
                <ExternalLink className="w-4 h-4 text-[var(--text-secondary)]" />
              </Link>
            </div>
          </div>

          {/* Medical Disclaimer */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h2 className="text-lg font-semibold text-red-800 mb-3">⚠️ Medical Disclaimer</h2>
            <p className="text-red-700 text-sm leading-relaxed">
              SafeDoser is not a substitute for professional medical advice, diagnosis, or treatment. 
              Always consult your healthcare provider before making any changes to your medication regimen. 
              In case of medical emergency, contact emergency services immediately.
            </p>
          </div>

          {/* Footer */}
          <div className="text-center py-6">
            <p className="text-[var(--text-secondary)] text-sm">
              Made with ❤️ for better health management
            </p>
            <p className="text-[var(--text-secondary)] text-xs mt-2">
              © 2025 SafeDoser. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AppInfo;