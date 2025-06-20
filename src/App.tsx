import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { TabProvider } from "./context/TabContext";
import Home from "./pages/Home";
import Scan from "./pages/Scan";
import AddManually from "./pages/Scan/Manually";
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
              <Route path="/scan" element={<Scan />} />
              <Route path="/scan/manual" element={<AddManually />} />
            </Routes>
          </Layout>
          <BottomNavBar />
        </TabProvider>
      </Router>
    </div>
  );
}

export default App;