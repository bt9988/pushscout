
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Binoculars, Menu, Plus, Search, X } from 'lucide-react';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const location = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check if admin is authenticated
  useEffect(() => {
    const checkAuth = () => {
      const isAuth = localStorage.getItem('admin_authenticated') === 'true';
      setIsAuthenticated(isAuth);
    };
    
    checkAuth();
    window.addEventListener('storage', checkAuth);
    
    return () => {
      window.removeEventListener('storage', checkAuth);
    };
  }, []);
  
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchValue.trim()) {
      window.location.href = `/?search=${encodeURIComponent(searchValue.trim())}`;
      setSearchOpen(false);
    }
  };
  
  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-background/80 backdrop-blur-md border-b' : 'bg-transparent'
      }`}
    >
      <div className="px-6 py-4 max-w-7xl mx-auto">
        <div className="flex items-center justify-between">
          <Link to="/" className="flex items-center space-x-1">
            <Binoculars className="w-6 h-6 text-primary" />
            <span className="text-xl font-semibold">PushScout</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <nav className="flex items-center space-x-6">
              <Link
                to="/"
                className={`text-sm hover:text-primary transition-colors ${
                  location.pathname === '/' ? 'text-primary font-medium' : 'text-foreground/80'
                }`}
              >
                Home
              </Link>
              <Link
                to="/submit"
                className={`text-sm hover:text-primary transition-colors ${
                  location.pathname === '/submit' ? 'text-primary font-medium' : 'text-foreground/80'
                }`}
              >
                Submit
              </Link>
              <Link
                to="/about"
                className={`text-sm hover:text-primary transition-colors ${
                  location.pathname === '/about' ? 'text-primary font-medium' : 'text-foreground/80'
                }`}
              >
                About
              </Link>
              {isAuthenticated && (
                <Link
                  to="/admin"
                  className={`text-sm hover:text-primary transition-colors ${
                    location.pathname === '/admin' ? 'text-primary font-medium' : 'text-foreground/80'
                  }`}
                >
                  Admin
                </Link>
              )}
            </nav>
            
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="sm"
                className="p-2"
                onClick={() => setSearchOpen(!searchOpen)}
              >
                <Search className="w-4 h-4" />
              </Button>
              
              <Button size="sm" asChild>
                <Link to="/submit" className="text-xs flex items-center">
                  <Plus className="mr-1 w-4 h-4" />
                  Submit
                </Link>
              </Button>
            </div>
          </div>
          
          <div className="md:hidden flex items-center">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="p-1">
                  <Menu className="w-5 h-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <SheetHeader className="mb-6">
                  <SheetTitle>
                    <div className="flex items-center space-x-2">
                      <Binoculars className="w-5 h-5 text-primary" />
                      <span>PushScout</span>
                    </div>
                  </SheetTitle>
                </SheetHeader>
                <nav className="flex flex-col space-y-4">
                  <Link
                    to="/"
                    className={`px-2 py-1 hover:bg-accent rounded-md transition-colors ${
                      location.pathname === '/' ? 'text-primary font-medium' : ''
                    }`}
                  >
                    Home
                  </Link>
                  <Link
                    to="/submit"
                    className={`px-2 py-1 hover:bg-accent rounded-md transition-colors ${
                      location.pathname === '/submit' ? 'text-primary font-medium' : ''
                    }`}
                  >
                    Submit
                  </Link>
                  <Link
                    to="/about"
                    className={`px-2 py-1 hover:bg-accent rounded-md transition-colors ${
                      location.pathname === '/about' ? 'text-primary font-medium' : ''
                    }`}
                  >
                    About
                  </Link>
                  {isAuthenticated && (
                    <Link
                      to="/admin"
                      className={`px-2 py-1 hover:bg-accent rounded-md transition-colors ${
                        location.pathname === '/admin' ? 'text-primary font-medium' : ''
                      }`}
                    >
                      Admin
                    </Link>
                  )}
                  <div className="pt-4">
                    <Button className="w-full" asChild>
                      <Link to="/submit">
                        <Plus className="mr-2 w-4 h-4" />
                        Submit Notification
                      </Link>
                    </Button>
                  </div>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
        
        {searchOpen && (
          <div className="absolute inset-x-0 top-16 px-6 py-4 bg-background shadow-lg rounded-lg z-10 animate-in fade-in slide-in-from-top-4">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="text"
                placeholder="Search notifications..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pr-10"
                autoFocus
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 p-1"
                onClick={() => setSearchOpen(false)}
              >
                <X className="w-4 h-4" />
              </Button>
            </form>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
