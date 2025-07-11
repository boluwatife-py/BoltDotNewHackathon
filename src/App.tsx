import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { TabProvider } from "./context/TabContext";
import { BottomSheetProvider } from "./context/BottomSheetContext";
import { UserProvider } from "./context/UserContext";
import ProtectedRoute from "./components/Auth/ProtectedRoute";

// Auth Pages
import Login from "./pages/Auth/Login";
import Signup from "./pages/Auth/Signup";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import EmailVerification from "./pages/Auth/EmailVerification";
import ResetPassword from "./pages/Auth/ResetPassword";
import VerificationSent from "./pages/Auth/VerificationSent";

// Legal Pages
import Terms from "./pages/Legal/Terms";
import Privacy from "./pages/Legal/Privacy";

// Protected Pages
import Home from "./pages/Home";
import Scan from "./pages/Scan";
import AddManually from "./pages/Scan/Manually";
import SupplementDone from "./pages/Scan/SupplementAdded";
import BottomNavBar from "./components/BottomNav/BottomNav";
import ByScan from "./pages/Scan/Scan";
import Layout from "./components/Layout";
import ScanResult from "./pages/Scan/ScanResults";
import ScanFailed from "./pages/Scan/ScanFailed";
import Cvs from "./pages/Scan/Cvs";
import Chatbot from "./pages/Chatbot";
import Settings from "./pages/Settings";
import SupplementList from "./pages/Settings/SupplementList";
import AppInfo from "./pages/Settings/AppInfo";
import DataPrivacy from "./pages/Settings/DataPrivacy";
import Scheduler from "./pages/Scheduler";
import NotFound from "./pages/NotFound";

// App Routes Component
function AppRoutes() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading screen while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[var(--border-dark)] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div className="flex flex-row gap-2">
            <div className="w-3 h-3 rounded-full bg-[var(--primary-color)] animate-bounce"></div>
            <div className="w-3 h-3 rounded-full bg-[var(--primary-color)] animate-bounce [animation-delay:-.3s]"></div>
            <div className="w-3 h-3 rounded-full bg-[var(--primary-color)] animate-bounce [animation-delay:-.5s]"></div>
          </div>
          <p className="text-[var(--text-secondary)] text-sm">Loading SafeDoser...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <Routes>
        <Route path="/auth/login" element={<Login />} />
        <Route path="/auth/signup" element={<Signup />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="/auth/verify-email" element={<EmailVerification />} />
        <Route path="/auth/reset-password" element={<ResetPassword />} />
        <Route path="/auth/verification-sent" element={<VerificationSent />} />
        {/* Legal pages accessible without authentication */}
        <Route path="/terms" element={<Terms />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    );
  }

  return (
    <TabProvider>
      <BottomSheetProvider>
        <UserProvider>
          <Layout>
            <Routes>
              <Route
                path="/"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/scan"
                element={
                  <ProtectedRoute>
                    <Scan />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/scan/manual"
                element={
                  <ProtectedRoute>
                    <AddManually />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/scan/add/done"
                element={
                  <ProtectedRoute>
                    <SupplementDone />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/scan/byscan"
                element={
                  <ProtectedRoute>
                    <ByScan />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/scan/result"
                element={
                  <ProtectedRoute>
                    <ScanResult />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/scan/scan-failed"
                element={
                  <ProtectedRoute>
                    <ScanFailed />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/scan/import"
                element={
                  <ProtectedRoute>
                    <Cvs />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/scheduler"
                element={
                  <ProtectedRoute>
                    <Scheduler />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/chatbot"
                element={
                  <ProtectedRoute>
                    <Chatbot />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/supplement-list"
                element={
                  <ProtectedRoute>
                    <SupplementList />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/app-info"
                element={
                  <ProtectedRoute>
                    <AppInfo />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings/privacy-data"
                element={
                  <ProtectedRoute>
                    <DataPrivacy />
                  </ProtectedRoute>
                }
              />
              {/* Legal pages accessible to authenticated users */}
              <Route path="/terms" element={<Terms />} />
              <Route path="/privacy" element={<Privacy />} />
              {/* Redirect auth routes to home if already authenticated */}
              <Route path="/auth/*" element={<Navigate to="/" replace />} />
              {/* 404 Page for any unmatched routes */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
          <BottomNavBar />
        </UserProvider>
      </BottomSheetProvider>
    </TabProvider>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <AppRoutes />
      </AuthProvider>
    </Router>
  );
}

export default App;