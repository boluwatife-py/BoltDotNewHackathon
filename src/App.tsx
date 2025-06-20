import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TabProvider } from "./context/TabContext";
import Home from "./pages/Home";
// import Scan from "./pages/Scan";
// import Scheduler from "./pages/Scheduler";
// import Chatbot from "./pages/Chatbot";
// import Settings from "./pages/Settings";
import BottomNavBar from "./components/BottomNav/BottomNav";
import Layout from "./components/Layout";

function App() {
  return (
    <div>
      <Router>
        <TabProvider>
          <Layout>
            <Routes>
              <Route path="/" element={<Home />} />
              {/* <Route path="/scan" element={<Scan />} />
              <Route path="/scheduler" element={<Scheduler />} />
              <Route path="/chatbot" element={<Chatbot />} />
              <Route path="/settings" element={<Settings />} /> */}
            </Routes>
          </Layout>
          <BottomNavBar />
        </TabProvider>
      </Router>
    </div>
  );
}

export default App;