import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield, Eye, Lock, Bot, Database, Users } from "lucide-react";

const Privacy: React.FC = () => {
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
          <h1 className="text-2xl font-bold text-[var(--text-primary)] mb-6">Privacy Policy</h1>
          
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
                At SafeDoser, we take your privacy seriously. This Privacy Policy explains how we collect, use, protect, and share your personal information when you use our medication and supplement tracking application. We are committed to protecting your health data and maintaining your trust.
              </p>
            </section>

            {/* Information We Collect */}
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Database className="w-5 h-5 text-[var(--primary-color)]" />
                2. Information We Collect
              </h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-2">Account Information</h3>
                  <ul className="text-[var(--text-secondary)] space-y-1 text-sm">
                    <li>• Name and email address</li>
                    <li>• Age (for age-appropriate recommendations)</li>
                    <li>• Profile picture (optional)</li>
                    <li>• Account preferences and settings</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-2">Health Information</h3>
                  <ul className="text-[var(--text-secondary)] space-y-1 text-sm">
                    <li>• Supplement and medication names, dosages, and schedules</li>
                    <li>• Medication adherence data (when you take your medications)</li>
                    <li>• Health-related questions and interactions with our AI assistant</li>
                    <li>• Supplement interaction preferences and notes</li>
                  </ul>
                </div>

                <div>
                  <h3 className="font-semibold text-[var(--text-primary)] mb-2">Usage Information</h3>
                  <ul className="text-[var(--text-secondary)] space-y-1 text-sm">
                    <li>• App usage patterns and feature interactions</li>
                    <li>• Device information and operating system</li>
                    <li>• Log data and error reports</li>
                    <li>• Chat messages with our AI assistant</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* AI Data Sharing */}
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Bot className="w-5 h-5 text-[var(--primary-color)]" />
                3. AI Assistant and Data Sharing
              </h2>
              <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                <h3 className="font-semibold text-orange-800 mb-3">Important: AI Data Sharing</h3>
                <p className="text-orange-700 leading-relaxed mb-3">
                  To provide you with personalized and relevant health guidance, SafeDoser shares certain information with our AI service provider (Google Gemini AI). This sharing is essential for the AI to understand your health context and provide appropriate recommendations.
                </p>
                
                <h4 className="font-semibold text-orange-800 mb-2">Data Shared with AI:</h4>
                <ul className="text-orange-700 text-sm space-y-1 mb-3">
                  <li>• Your name and age (for personalized, age-appropriate advice)</li>
                  <li>• Your current supplement and medication list</li>
                  <li>• Your questions and chat messages</li>
                  <li>• Relevant health context you provide</li>
                  <li>• Medication timing and adherence patterns</li>
                </ul>

                <h4 className="font-semibold text-orange-800 mb-2">Why We Share This Data:</h4>
                <ul className="text-orange-700 text-sm space-y-1 mb-3">
                  <li>• To provide personalized supplement and medication guidance</li>
                  <li>• To check for potential drug interactions based on your specific regimen</li>
                  <li>• To offer age-appropriate health recommendations</li>
                  <li>• To maintain conversation context for better assistance</li>
                </ul>

                <p className="text-orange-700 text-sm leading-relaxed">
                  <strong>Your Control:</strong> You can manage your AI data sharing preferences in the Settings page. However, limiting data sharing may reduce the personalization and effectiveness of AI recommendations.
                </p>
              </div>
            </section>

            {/* How We Use Your Information */}
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Eye className="w-5 h-5 text-[var(--primary-color)]" />
                4. How We Use Your Information
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-3">We use your information to:</p>
              <ul className="text-[var(--text-secondary)] space-y-2">
                <li>• Provide and maintain the SafeDoser service</li>
                <li>• Send medication and supplement reminders</li>
                <li>• Provide personalized AI-powered health guidance</li>
                <li>• Improve our app features and user experience</li>
                <li>• Ensure the security and integrity of our service</li>
                <li>• Communicate with you about your account and our services</li>
                <li>• Comply with legal obligations</li>
              </ul>
            </section>

            {/* Data Security */}
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Lock className="w-5 h-5 text-[var(--primary-color)]" />
                5. Data Security
              </h2>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 leading-relaxed mb-3">
                  We implement industry-standard security measures to protect your personal and health information:
                </p>
                <ul className="text-green-700 text-sm space-y-1">
                  <li>• End-to-end encryption for data transmission</li>
                  <li>• Secure cloud storage with access controls</li>
                  <li>• Regular security audits and updates</li>
                  <li>• Limited access to your data on a need-to-know basis</li>
                  <li>• Secure authentication and session management</li>
                </ul>
              </div>
            </section>

            {/* Data Sharing and Disclosure */}
            <section>
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Users className="w-5 h-5 text-[var(--primary-color)]" />
                6. Data Sharing and Disclosure
              </h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-3">
                We do not sell your personal information. We may share your information only in the following circumstances:
              </p>
              <ul className="text-[var(--text-secondary)] space-y-2">
                <li>• <strong>AI Service Providers:</strong> With Google Gemini AI for providing personalized health guidance (as described above)</li>
                <li>• <strong>Service Providers:</strong> With trusted third-party services that help us operate SafeDoser (under strict confidentiality agreements)</li>
                <li>• <strong>Legal Requirements:</strong> When required by law or to protect our rights and safety</li>
                <li>• <strong>Emergency Situations:</strong> To prevent serious harm to you or others</li>
                <li>• <strong>Business Transfers:</strong> In connection with a merger, acquisition, or sale of assets (with continued privacy protection)</li>
              </ul>
            </section>

            {/* Your Rights and Choices */}
            <section>
              <h2 className="text-xl font-semibold mb-3">7. Your Rights and Choices</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed mb-3">You have the right to:</p>
              <ul className="text-[var(--text-secondary)] space-y-2">
                <li>• Access and review your personal information</li>
                <li>• Update or correct your account information</li>
                <li>• Delete your account and associated data</li>
                <li>• Control AI data sharing preferences</li>
                <li>• Opt out of non-essential communications</li>
                <li>• Request a copy of your data</li>
                <li>• Withdraw consent for data processing (where applicable)</li>
              </ul>
              <p className="text-[var(--text-secondary)] leading-relaxed mt-3">
                You can exercise these rights through the Settings page in the app or by contacting us directly.
              </p>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-xl font-semibold mb-3">8. Data Retention</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                We retain your information for as long as your account is active or as needed to provide you services. We may retain certain information for longer periods as required by law or for legitimate business purposes. When you delete your account, we will delete your personal information within 30 days, except where retention is required by law.
              </p>
            </section>

            {/* Children's Privacy */}
            <section>
              <h2 className="text-xl font-semibold mb-3">9. Children's Privacy</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                SafeDoser is not intended for children under 13. We do not knowingly collect personal information from children under 13. If you are between 13 and 18, you must have parental consent to use our service. If we learn that we have collected information from a child under 13, we will delete that information immediately.
              </p>
            </section>

            {/* International Users */}
            <section>
              <h2 className="text-xl font-semibold mb-3">10. International Users</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                SafeDoser is operated from the United States. If you are accessing our service from outside the US, please be aware that your information may be transferred to, stored, and processed in the United States. By using our service, you consent to this transfer.
              </p>
            </section>

            {/* Changes to Privacy Policy */}
            <section>
              <h2 className="text-xl font-semibold mb-3">11. Changes to This Privacy Policy</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                We may update this Privacy Policy from time to time to reflect changes in our practices or for legal reasons. We will notify you of any material changes by posting the new Privacy Policy in the app and updating the "Last Updated" date. We encourage you to review this Privacy Policy periodically.
              </p>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-xl font-semibold mb-3">12. Contact Us</h2>
              <p className="text-[var(--text-secondary)] leading-relaxed">
                If you have any questions about this Privacy Policy or our privacy practices, please contact us through the app's support feature. We are committed to addressing your privacy concerns promptly and transparently.
              </p>
            </section>
          </div>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-[var(--border-grey)]">
            <div className="flex flex-col sm:flex-row gap-4 justify-between items-center">
              <Link
                to="/terms"
                className="text-[var(--primary-color)] hover:underline text-sm"
              >
                View Terms and Conditions
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

export default Privacy;