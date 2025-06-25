import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TabProvider } from "./context/TabContext";
import { BottomSheetProvider } from "./context/BottomSheetContext";
import Home from "./pages/Home";
import Scan from "./pages/Scan";
import AddManually from "./pages/Scan/Manually";
import SupplementDone from "./pages/Scan/SupplementAdded";
import BottomNavBar from "./components/BottomNav/BottomNav";
import ByScan from "./pages/Scan/Scan";
import Layout from "./components/Layout";
import ScanResult from "./pages/Scan/ScanResults";
import Cvs from "./pages/Scan/Cvs";
import Chatbot from "./pages/Chatbot";
import Settings from "./pages/Settings";
import SupplementList from "./pages/Settings/SupplementList";

function App() {
  return (
    <div>
      <Router>
        <TabProvider>
          <BottomSheetProvider>
            <Layout>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/scan" element={<Scan />} />
                <Route path="/scan/manual" element={<AddManually />} />
                <Route path="/scan/add/done" element={<SupplementDone />} />
                <Route path="/scan/byscan" element={<ByScan />} />
                <Route path="/scan/result" element={<ScanResult />} />
                <Route path="/scan/import" element={<Cvs />} />
                <Route path="/chatbot" element={<Chatbot />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/settings/supplement-list" element={<SupplementList />} />
              </Routes>
            </Layout>
            <BottomNavBar />
          </BottomSheetProvider>
        </TabProvider>
      </Router>
    </div>
  );
}

export default App;