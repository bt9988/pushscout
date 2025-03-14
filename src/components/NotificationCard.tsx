
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Notification } from '@/types';
import { Badge } from '@/components/ui/badge';
import { Heart, Eye } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

interface NotificationCardProps {
  notification: Notification;
  priority?: 'featured' | 'standard';
}

const NotificationCard = ({ notification, priority = 'standard' }: NotificationCardProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

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

  return (
    <Link 
      to={`/notification/${notification.id}`}
      className={`group block overflow-hidden transition-all duration-300 ${
        priority === 'featured' 
          ? 'rounded-2xl border border-border shadow-lg hover:shadow-xl' 
          : 'rounded-xl border border-border shadow-sm hover:shadow-md'
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`relative overflow-hidden bg-gray-100 ${
        priority === 'featured' ? 'aspect-[16/5]' : 'aspect-[16/6]'
      }`}>
        <div className={`absolute inset-0 bg-gradient-to-t from-black/10 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ${
          isHovered ? 'opacity-100' : 'opacity-0'
        }`} />
        
        {!imageLoaded && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
            <div className="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
          </div>
        )}
        
        <img
          src={notification.imageUrl}
          alt={notification.title}
          className={`w-full h-full object-cover transition-transform duration-500 ${
            isHovered ? 'scale-105' : 'scale-100'
          } ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
          onLoad={() => setImageLoaded(true)}
          onError={(e) => {
            // If image fails to load, set a placeholder or fallback
            (e.target as HTMLImageElement).src = '/placeholder.svg';
            setImageLoaded(true);
          }}
        />
        
        <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2 z-20">
          <Badge className={`font-medium ${getTypeColor(notification.type)}`}>
            {notification.type.charAt(0).toUpperCase() + notification.type.slice(1)}
          </Badge>
          <Badge className={`font-medium ${getIndustryColor(notification.industry)}`}>
            {notification.industry.charAt(0).toUpperCase() + notification.industry.slice(1)}
          </Badge>
        </div>
      </div>
      
      <div className={`p-4 ${priority === 'featured' ? 'p-5' : 'p-4'}`}>
        <h3 className={`font-medium text-foreground mb-1 ${priority === 'featured' ? 'text-lg' : 'text-base'}`}>
          {notification.title}
        </h3>
        <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
          {notification.message}
        </p>
        
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium">{notification.retailer}</span>
          
          <div className="flex items-center space-x-4 text-muted-foreground">
            <div className="flex items-center">
              <Heart className="w-3.5 h-3.5 mr-1" />
              <span>{notification.likes}</span>
            </div>
            <div className="flex items-center">
              <Eye className="w-3.5 h-3.5 mr-1" />
              <span>{notification.views}</span>
            </div>
            <span>{formatDistanceToNow(notification.submittedAt, { addSuffix: true })}</span>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default NotificationCard;
