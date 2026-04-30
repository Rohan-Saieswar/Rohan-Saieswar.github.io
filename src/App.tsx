import { Routes, Route, Navigate } from 'react-router-dom';
import MagneticCursor from './components/MagneticCursor';
import SpotifyWidget from './components/SpotifyWidget';
import DynamicIsland from './components/DynamicIsland';
import Header from './components/Header';
import Home from './pages/Home';
import Experience from './pages/Experience';
import PortfolioPage from './pages/PortfolioPage';
import ConnectPage from './pages/ConnectPage';
import './App.css';

function App() {
  return (
    <>
      <MagneticCursor />
      <Header />
      <DynamicIsland />
      <SpotifyWidget />
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/experience" element={<Experience />} />
        <Route path="/portfolio"  element={<PortfolioPage />} />
        <Route path="/connect"    element={<ConnectPage />} />
        {/* Redirect old routes */}
        <Route path="/education"    element={<Navigate to="/portfolio" replace />} />
        <Route path="/projects"     element={<Navigate to="/portfolio" replace />} />
        <Route path="/certificates" element={<Navigate to="/portfolio" replace />} />
        <Route path="/fun"          element={<Navigate to="/connect"   replace />} />
        <Route path="/contact"      element={<Navigate to="/connect"   replace />} />
      </Routes>
    </>
  );
}

export default App;
