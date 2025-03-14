
import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { getNotificationById } from '@/lib/data';
import { Notification } from '@/types';
import { ArrowLeft, Heart, Eye, Share2, Clock, User, Binoculars } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

const Detail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [notification, setNotification] = useState<Notification | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [imageLoaded, setImageLoaded] = useState(false);
  
  useEffect(() => {
    const loadNotification = async () => {
      setIsLoading(true);
      
      try {
        // Simulate API fetch with delay
        await new Promise(resolve => setTimeout(resolve, 800));
        
        if (!id) {
          navigate('/');
          return;
        }
        
        const data = getNotificationById(id);
        
        if (!data) {
          toast({
            title: "Notification not found",
            description: "The notification you're looking for doesn't exist",
            variant: "destructive",
          });
          navigate('/');
          return;
        }
        
        setNotification(data);
      } catch (error) {
        toast({
          title: "Error loading notification",
          description: "There was a problem loading the notification details",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };
    
    loadNotification();
  }, [id, navigate, toast]);
  
  const handleBrandClick = (brand: string) => {
    navigate(`/?brand=${brand}`);
  };
  
  const getTypeColor = (type: string) => {
    switch (type) {
      case 'promotional': return 'bg-blue-100 text-blue-800';
      case 'transactional': return 'bg-green-100 text-green-800';
      case 'engagement': return 'bg-purple-100 text-purple-800';
      case 'informational': return 'bg-amber-100 text-amber-800';
      case 'update': return 'bg-sky-100 text-sky-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getIndustryColor = (industry: string) => {
    switch (industry) {
      case 'ecommerce': return 'bg-pink-100 text-pink-800';
      case 'finance': return 'bg-emerald-100 text-emerald-800';
      case 'travel': return 'bg-cyan-100 text-cyan-800';
      case 'food': return 'bg-orange-100 text-orange-800';
      case 'health': return 'bg-lime-100 text-lime-800';
      case 'technology': return 'bg-indigo-100 text-indigo-800';
      case 'entertainment': return 'bg-fuchsia-100 text-fuchsia-800';
      case 'education': return 'bg-teal-100 text-teal-800';
      case 'social media': return 'bg-rose-100 text-rose-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: notification?.title || 'Push Notification',
        text: notification?.message || '',
        url: window.location.href,
      }).catch(err => {
        console.error('Error sharing:', err);
      });
    } else {
      // Fallback for browsers that don't support navigator.share
      navigator.clipboard.writeText(window.location.href).then(() => {
        toast({
          title: "Link copied",
          description: "Notification link copied to clipboard",
        });
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="px-6 max-w-5xl mx-auto">
          {isLoading ? (
            <div className="py-20 flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
              <p className="text-muted-foreground">Loading notification...</p>
            </div>
          ) : notification ? (
            <div className="animate-fade-in">
              {/* Back Button */}
              <Button 
                variant="ghost" 
                asChild 
                className="mb-6 hover:bg-transparent p-0 h-auto"
              >
                <Link to="/" className="flex items-center text-muted-foreground hover:text-foreground">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Gallery
                </Link>
              </Button>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
                {/* Image Column */}
                <div className="order-2 lg:order-1">
                  <div className="sticky top-24 overflow-hidden rounded-xl border border-border shadow-lg bg-white">
                    {!imageLoaded && (
                      <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                        <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                      </div>
                    )}
                    <img
                      src={notification.imageUrl}
                      alt={notification.title}
                      className={`w-full h-auto ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
                      onLoad={() => setImageLoaded(true)}
                    />
                  </div>
                </div>
                
                {/* Content Column */}
                <div className="order-1 lg:order-2">
                  <div className="flex flex-wrap gap-2 mb-4">
                    <Badge className={`font-medium ${getTypeColor(notification.type)}`}>
                      {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
                    </Badge>
                    <Badge className={`font-medium ${getIndustryColor(notification.industry)}`}>
                      {notification.industry.charAt(0).toUpperCase() + notification.industry.slice(1)}
                    </Badge>
                  </div>
                  
                  <h1 className="text-3xl font-bold mb-3">{notification.title}</h1>
                  
                  <div className="flex items-center text-sm text-muted-foreground mb-6">
                    <div className="flex items-center mr-4">
                      <Clock className="w-4 h-4 mr-1.5" />
                      <span>{formatDistanceToNow(notification.submittedAt, { addSuffix: true })}</span>
                    </div>
                    {notification.submittedBy && (
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-1.5" />
                        <span>{notification.submittedBy}</span>
                      </div>
                    )}
                  </div>
                  
                  <div className="p-6 mb-6 bg-secondary rounded-xl">
                    <div className="flex items-center mb-4">
                      <button 
                        onClick={() => handleBrandClick(notification.retailer)}
                        className="font-semibold text-primary hover:underline focus:outline-none"
                      >
                        {notification.retailer}
                      </button>
                    </div>
                    <p className="text-lg mb-6">{notification.message}</p>
                    <div className="flex items-center justify-between text-sm text-muted-foreground">
                      <div className="flex items-center space-x-4">
                        <div className="flex items-center">
                          <Heart className="w-4 h-4 mr-1.5" />
                          <span>{notification.likes || 0} likes</span>
                        </div>
                        <div className="flex items-center">
                          <Eye className="w-4 h-4 mr-1.5" />
                          <span>{notification.views || 0} views</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    <Button
                      onClick={handleShare}
                      variant="outline"
                      className="flex-1 flex items-center justify-center"
                    >
                      <Share2 className="mr-2 h-4 w-4" />
                      Share
                    </Button>
                    <Button
                      asChild
                      className="flex-1 flex items-center justify-center"
                    >
                      <Link to="/submit">
                        Submit Your Own
                      </Link>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="text-xl mb-4">Notification not found</p>
              <Button asChild>
                <Link to="/">Return to Gallery</Link>
              </Button>
            </div>
          )}
        </div>
      </main>
      
      {/* Footer */}
      <footer className="mt-auto py-8 border-t border-border">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-1 mb-4 md:mb-0">
              <Binoculars className="w-5 h-5 text-primary" />
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

export default Detail;
