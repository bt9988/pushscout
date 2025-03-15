
import { useEffect } from 'react';
import { Routes, Route } from 'react-router-dom';
import Index from '@/pages/Index';
import Detail from '@/pages/Detail';
import Submit from '@/pages/Submit';
import About from '@/pages/About';
import Admin from '@/pages/Admin';
import NotFound from '@/pages/NotFound';
import { Toaster } from '@/components/ui/toaster';
import { loadStoredNotifications } from './lib/data';

function App() {
  // Load stored notifications from localStorage on app startup
  useEffect(() => {
    loadStoredNotifications();
  }, []);
  
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
