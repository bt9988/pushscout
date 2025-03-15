
import { useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Index from '@/pages/Index';
import Detail from '@/pages/Detail';
import Submit from '@/pages/Submit';
import About from '@/pages/About';
import Admin from '@/pages/Admin';
import NotFound from '@/pages/NotFound';
import { Toaster } from '@/components/ui/toaster';
import { loadStoredNotifications } from './lib/data';

// Define the gtag function for TypeScript
declare global {
  interface Window {
    gtag: (command: string, action: string, params?: any) => void;
    dataLayer: any[];
  }
}

function App() {
  const location = useLocation();
  
  // Load stored notifications from localStorage on app startup
  useEffect(() => {
    loadStoredNotifications();
  }, []);
  
  // Track page views with Google Analytics
  useEffect(() => {
    // Send pageview with a custom path
    window.gtag?.('config', 'G-R5V8YD7HJG', {
      page_path: location.pathname + location.search
    });
  }, [location]);
  
  return (
    <>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/notification/:id" element={<Detail />} />
        <Route path="/submit" element={<Submit />} />
        <Route path="/about" element={<About />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
      <Toaster />
    </>
  );
}

export default App;
