import { Routes, Route } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import Header from './components/layout/Header';

import LandingPage from './pages/LandingPage';
import UploadPage from './pages/UploadPage';
import ProcessingPage from './pages/ProcessingPage';
import ResultsPage from './pages/ResultsPage';
import InsightsPage from './pages/InsightsPage';
import DashboardPage from './pages/DashboardPage';
import NotFoundPage from './pages/NotFoundPage';
import { useTheme } from './contexts/theme-context';
import { Toaster } from './components/ui/toaster';

function App() {
  const { theme } = useTheme();
  
  return (
    <div className={theme}>
      <div className="min-h-screen bg-background font-sans">
        <Header />
        <main>
          <AnimatePresence mode="wait">
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/upload" element={<UploadPage />} />
              <Route path="/processing" element={<ProcessingPage />} />
              <Route path="/results/:id" element={<ResultsPage />} />
              <Route path="/insights/:id" element={<InsightsPage />} />
              <Route path="/dashboard/*" element={<DashboardPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </AnimatePresence>
        </main>
      
        <Toaster />
      </div>
    </div>
  );
}

export default App;