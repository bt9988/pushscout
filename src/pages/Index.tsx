import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import NotificationCard from '@/components/NotificationCard';
import FilterSection from '@/components/FilterSection';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { ArrowRight, Bell, Plus } from 'lucide-react';
import { mockNotifications, getUniqueRetailers } from '@/lib/data';
import { Industry, Notification, NotificationType } from '@/types';

const Index = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [filteredNotifications, setFilteredNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [retailers, setRetailers] = useState<string[]>([]);
  const [selectedRetailers, setSelectedRetailers] = useState<string[]>([]);
  const [selectedIndustries, setSelectedIndustries] = useState<Industry[]>([]);
  const [selectedTypes, setSelectedTypes] = useState<NotificationType[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await new Promise(resolve => setTimeout(resolve, 1000));
      setNotifications(mockNotifications);
      setRetailers(getUniqueRetailers());
      setIsLoading(false);
    };

    loadData();
  }, []);

  useEffect(() => {
    let result = [...notifications];
    
    if (selectedRetailers.length > 0) {
      result = result.filter(notification => 
        selectedRetailers.includes(notification.retailer)
      );
    }
    
    if (selectedIndustries.length > 0) {
      result = result.filter(notification => 
        selectedIndustries.includes(notification.industry)
      );
    }
    
    if (selectedTypes.length > 0) {
      result = result.filter(notification => 
        selectedTypes.includes(notification.type)
      );
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(notification => 
        notification.title.toLowerCase().includes(term) ||
        notification.message.toLowerCase().includes(term) ||
        notification.retailer.toLowerCase().includes(term)
      );
    }
    
    setFilteredNotifications(result);
  }, [notifications, selectedRetailers, selectedIndustries, selectedTypes, searchTerm]);

  const featuredNotification = notifications.length > 0 ? notifications[0] : null;
  
  const restNotifications = filteredNotifications.filter(
    notification => notification.id !== featuredNotification?.id
  );

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <section className="px-6 mb-16 max-w-7xl mx-auto">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4 text-balance animate-slide-up">
              Discover inspiring mobile <span className="text-primary">notifications</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '100ms' }}>
              A community-driven gallery of push notification designs from top brands.
              Filter by industry, retailer, or notification type.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '200ms' }}>
              <Button asChild size="lg" className="w-full sm:w-auto">
                <Link to="/submit" className="flex items-center">
                  <Plus className="mr-2 h-5 w-5" />
                  Submit a Notification
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="w-full sm:w-auto">
                <a href="#gallery" className="flex items-center">
                  Explore Gallery
                  <ArrowRight className="ml-2 h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>
        
        <section id="gallery" className="px-6 max-w-7xl mx-auto">
          <FilterSection 
            retailers={retailers}
            selectedRetailers={selectedRetailers}
            setSelectedRetailers={setSelectedRetailers}
            selectedIndustries={selectedIndustries}
            setSelectedIndustries={setSelectedIndustries}
            selectedTypes={selectedTypes}
            setSelectedTypes={setSelectedTypes}
            searchTerm={searchTerm}
            setSearchTerm={setSearchTerm}
          />
          
          {isLoading ? (
            <div className="py-20 flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="text-muted-foreground">Loading notifications...</p>
            </div>
          ) : filteredNotifications.length === 0 ? (
            <div className="py-20 text-center">
              <p className="text-xl mb-4">No notifications found</p>
              <p className="text-muted-foreground mb-8">Try adjusting your filters or search term</p>
              <Button onClick={() => {
                setSelectedRetailers([]);
                setSelectedIndustries([]);
                setSelectedTypes([]);
                setSearchTerm('');
              }}>
                Clear Filters
              </Button>
            </div>
          ) : (
            <div className="mt-8">
              {!searchTerm && selectedRetailers.length === 0 && 
               selectedIndustries.length === 0 && selectedTypes.length === 0 && 
               featuredNotification && (
                <div className="mb-12">
                  <h2 className="text-xl font-semibold mb-6">Featured Notification</h2>
                  <NotificationCard notification={featuredNotification} priority="featured" />
                </div>
              )}
              
              <div className="mb-8">
                <h2 className="text-xl font-semibold mb-6">
                  {filteredNotifications.length} Notification{filteredNotifications.length !== 1 ? 's' : ''}
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {restNotifications.map(notification => (
                    <NotificationCard 
                      key={notification.id} 
                      notification={notification}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </section>
      </main>
      
      <footer className="py-8 border-t border-border">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-1 mb-4 md:mb-0">
              <Bell className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold">PushScout</span>
            </div>
            <div className="flex space-x-6">
              <Link to="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</Link>
              <Link to="/submit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Submit</Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} PushScout. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;
