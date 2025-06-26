import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Users, Database, Bot } from "lucide-react";

const Terms: React.FC = () => {
  return (
    <div className="min-h-screen bg-[var(--border-dark)]">
      {/* Header */}
      <div className="bg-white px-4 py-6 border-b border-[var(--border-grey)]">
        <div className="flex items-center">
          <Link
            to="/auth/signup"
            className="p-2 -ml-2 text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
          >
            <ArrowLeft size={20} />
          </Link>
          <div className="flex-1 text-center">
            <h1 className="text-[1.5rem] font-bold text-[var(--primary-color)]">SafeDoser</h1>
          </div>
          <div className="w-8"></div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl shadow-sm border border-[var(--border-grey)] p-6">
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Terms and Conditions</h1>
          
          <div className="space-y-6 text-[var(--text-primary)]">
            {/* Last Updated */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm">
                <strong>Last Updated:</strong> January 2025<br />
                <strong>Version:</strong> 1.0.1
              </p>
            </div>

            {/* Introduction */}
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-[var(--primary-color)]" />
                1. Introduction
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                Welcome to SafeDoser ("we," "our," or "us"). These Terms and Conditions ("Terms") govern your use of the SafeDoser mobile application and related services (the "Service"). By accessing or using our Service, you agree to be bound by these Terms.
              </p>
            </section>

            {/* Acceptance of Terms */}
            <section>
              <h2 className="text-xl font-semibold mb-3">2. Acceptance of Terms</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-3">
                By creating an account or using SafeDoser, you acknowledge that you have read, understood, and agree to be bound by these Terms and our Privacy Policy. If you do not agree to these Terms, please do not use our Service.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                You must be at least 13 years old to use SafeDoser. If you are under 18, you must have parental or guardian consent to use our Service.
              </p>
            </section>

            {/* Medical Disclaimer */}
            <section>
              <h2 className="text-xl font-semibold mb-3 text-red-600">3. Medical Disclaimer</h2>
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <p className="text-red-800 leading-relaxed mb-3">
                  <strong>IMPORTANT:</strong> SafeDoser is NOT a substitute for professional medical advice, diagnosis, or treatment. Our Service is designed to help you track and manage your supplements and medications, but it does not provide medical advice.
                </p>
                <ul className="text-red-700 text-sm space-y-1">
                  <li>• Always consult your healthcare provider before starting, stopping, or changing any medication or supplement regimen</li>
                  <li>• Never ignore professional medical advice or delay seeking it because of information from SafeDoser</li>
                  <li>• In case of medical emergency, contact emergency services immediately</li>
                  <li>• Our AI assistant provides general information only and cannot replace professional medical consultation</li>
                </ul>
              </div>
            </section>

            {/* AI and Data Sharing */}
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Bot className="w-5 h-5 text-[var(--primary-color)]" />
                4. AI Assistant and Data Sharing
              </h2>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-blue-800 leading-relaxed mb-3">
                  <strong>AI-Powered Features:</strong> SafeDoser includes an AI assistant powered by Google Gemini AI to provide general supplement and medication information.
                </p>
                <p className="text-blue-700 text-sm leading-relaxed mb-3">
                  <strong>Data Shared with AI:</strong> To provide personalized assistance, we may share the following information with our AI service:
                </p>
                <ul className="text-blue-700 text-sm space-y-1 mb-3">
                  <li>• Your name and age (for age-appropriate recommendations)</li>
                  <li>• Your current supplement and medication list</li>
                  <li>• Your chat messages and questions</li>
                  <li>• General health context you provide</li>
                </ul>
                <p className="text-blue-700 text-sm leading-relaxed">
                  This data is processed securely and used only to improve the relevance and safety of AI responses. You can manage your AI data preferences in the Settings page.
                </p>
              </div>
            </section>

            {/* User Responsibilities */}
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--primary-color)]" />
                5. User Responsibilities
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-3">You agree to:</p>
              <ul className="text-[var(--text-secondary)] space-y-2">
                <li>• Provide accurate and complete information about your medications and supplements</li>
                <li>• Keep your account information secure and confidential</li>
                <li>• Use the Service only for lawful purposes</li>
                <li>• Not share your account with others</li>
                <li>• Notify us immediately of any unauthorized use of your account</li>
                <li>• Take full responsibility for all activities under your account</li>
              </ul>
            </section>

            {/* Data and Privacy */}
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Database className="w-5 h-5 text-[var(--primary-color)]" />
                6. Data and Privacy
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-3">
                Your privacy is important to us. Our collection, use, and protection of your personal information is governed by our Privacy Policy, which is incorporated into these Terms by reference.
              </p>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                By using SafeDoser, you consent to the collection and use of your information as described in our Privacy Policy, including the sharing of certain data with our AI service providers for the purpose of providing personalized assistance.
              </p>
            </section>

            {/* Prohibited Uses */}
            <section>
              <h2 className="text-xl font-semibold mb-3">7. Prohibited Uses</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-3">You may not use SafeDoser to:</p>
              <ul className="text-[var(--text-secondary)] space-y-2">
                <li>• Violate any applicable laws or regulations</li>
                <li>• Share false or misleading health information</li>
                <li>• Attempt to gain unauthorized access to our systems</li>
                <li>• Use the Service for commercial purposes without permission</li>
                <li>• Interfere with or disrupt the Service</li>
                <li>• Upload malicious code or content</li>
              </ul>
            </section>

            {/* Limitation of Liability */}
            <section>
              <h2 className="text-xl font-semibold mb-3">8. Limitation of Liability</h2>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                <p className="text-yellow-800 leading-relaxed">
                  SafeDoser is provided "as is" without warranties of any kind. We are not liable for any health consequences, medication errors, or other damages resulting from your use of the Service. Your use of SafeDoser is at your own risk.
                </p>
              </div>
            </section>

            {/* Changes to Terms */}
            <section>
              <h2 className="text-xl font-semibold mb-3">9. Changes to Terms</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                We may update these Terms from time to time. We will notify you of any material changes by posting the new Terms in the app and updating the "Last Updated" date. Your continued use of SafeDoser after such changes constitutes acceptance of the new Terms.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-xl font-semibold mb-3">10. Contact Us</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                If you have any questions about these Terms, please contact us through the app's support feature or visit our website for additional contact information.
              </p>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[var(--border-grey)]">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <Link
                to="/privacy"
                className="text-[var(--primary-color)] hover:underline text-sm"
              >
                View Privacy Policy
              </Link>
              <p className="text-xs text-[var(--text-secondary)]">
                SafeDoser v1.0.1 - Your Personal Medication Companion
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;