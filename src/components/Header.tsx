
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bell, Search, PlusCircle, Menu, X, Binoculars } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ${
        isScrolled ? 'bg-white/80 backdrop-blur-md shadow-sm' : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center space-x-1">
          <div className="relative w-6 h-6 text-primary">
            <Binoculars className="w-6 h-6 absolute top-0 left-0" />
            <Bell className="w-3 h-3 absolute bottom-0 right-0" />
          </div>
          <Link to="/" className="text-xl font-semibold">
            PushScout
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          <Link 
            to="/" 
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/' ? 'text-primary' : 'text-foreground hover:text-primary'
            }`}
          >
            Gallery
          </Link>
          <Link 
            to="/submit" 
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/submit' ? 'text-primary' : 'text-foreground hover:text-primary'
            }`}
          >
            Submit
          </Link>
          <Link 
            to="/about" 
            className={`text-sm font-medium transition-colors ${
              location.pathname === '/about' ? 'text-primary' : 'text-foreground hover:text-primary'
            }`}
          >
            About
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="rounded-full">
            <Search className="w-5 h-5" />
          </Button>
          <Button asChild>
            <Link to="/submit" className="flex items-center space-x-2">
              <PlusCircle className="w-4 h-4" />
              <span>Submit</span>
            </Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="md:hidden rounded-full"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Mobile Menu */}
      <div className={`
        md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md shadow-md
        transition-all duration-300 overflow-hidden
        ${mobileMenuOpen ? 'max-h-[300px] border-b border-border' : 'max-h-0'}
      `}>
        <div className="px-6 py-4 flex flex-col space-y-4">
          <Link 
            to="/" 
            className={`text-base font-medium ${location.pathname === '/' ? 'text-primary' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Gallery
          </Link>
          <Link 
            to="/submit" 
            className={`text-base font-medium ${location.pathname === '/submit' ? 'text-primary' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            Submit
          </Link>
          <Link 
            to="/about" 
            className={`text-base font-medium ${location.pathname === '/about' ? 'text-primary' : ''}`}
            onClick={() => setMobileMenuOpen(false)}
          >
            About
          </Link>
          <div className="pt-2 border-t border-border">
            <Button asChild className="w-full justify-center">
              <Link to="/submit" onClick={() => setMobileMenuOpen(false)}>
                Submit Notification
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
