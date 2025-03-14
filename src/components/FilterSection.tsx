import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Check, ChevronDown, Search, X } from 'lucide-react';
import { 
  Select, 
  SelectContent, 
  SelectGroup, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Industry, NotificationType } from '@/types';
import { industries, notificationTypes } from '@/lib/data';

interface FilterSectionProps {
  retailers: string[];
  selectedRetailers: string[];
  setSelectedRetailers: (retailers: string[]) => void;
  selectedIndustries: Industry[];
  setSelectedIndustries: (industries: Industry[]) => void;
  selectedTypes: NotificationType[];
  setSelectedTypes: (types: NotificationType[]) => void;
  searchTerm: string;
  setSearchTerm: (term: string) => void;
}

const FilterSection = ({
  retailers,
  selectedRetailers,
  setSelectedRetailers,
  selectedIndustries,
  setSelectedIndustries,
  selectedTypes,
  setSelectedTypes,
  searchTerm,
  setSearchTerm
}: FilterSectionProps) => {
  const [showFilters, setShowFilters] = useState(false);
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, []);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setLocalSearchTerm(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      setSearchTerm(value);
    }, 300);
  };

  const handleRetailerSelect = (retailer: string) => {
    if (selectedRetailers.includes(retailer)) {
      setSelectedRetailers(selectedRetailers.filter(r => r !== retailer));
    } else {
      setSelectedRetailers([...selectedRetailers, retailer]);
    }
  };
  
  const handleIndustrySelect = (industry: Industry) => {
    if (selectedIndustries.includes(industry)) {
      setSelectedIndustries(selectedIndustries.filter(i => i !== industry));
    } else {
      setSelectedIndustries([...selectedIndustries, industry]);
    }
  };
  
  const handleTypeSelect = (type: NotificationType) => {
    if (selectedTypes.includes(type)) {
      setSelectedTypes(selectedTypes.filter(t => t !== type));
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const clearAllFilters = () => {
    setSelectedRetailers([]);
    setSelectedIndustries([]);
    setSelectedTypes([]);
    setSearchTerm('');
    setLocalSearchTerm('');
  };

  const hasActiveFilters = selectedRetailers.length > 0 || 
    selectedIndustries.length > 0 || 
    selectedTypes.length > 0 || 
    searchTerm.length > 0;

  return (
    <div className="w-full animate-fade-in">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            value={localSearchTerm}
            onChange={handleSearchChange}
            placeholder="Search notifications..."
            className="pl-10 pr-10 rounded-full border-muted bg-transparent focus-visible:ring-offset-0"
          />
          {localSearchTerm && (
            <Button
              variant="ghost"
              size="icon"
              onClick={() => {
                setLocalSearchTerm('');
                setSearchTerm('');
              }}
              className="absolute right-1 top-1/2 transform -translate-y-1/2 h-7 w-7 rounded-full"
            >
              <X className="h-3.5 w-3.5 text-muted-foreground" />
            </Button>
          )}
        </div>
        
        <div className="flex flex-wrap gap-2 items-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-1 rounded-full"
          >
            <span>Filters</span>
            <ChevronDown
              className={`h-4 w-4 transition-transform ${showFilters ? 'rotate-180' : ''}`}
            />
          </Button>
          
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearAllFilters}
              className="text-muted-foreground hover:text-foreground"
            >
              Clear all
            </Button>
          )}
          
          {selectedRetailers.length > 0 && (
            <div className="flex gap-1 items-center overflow-x-auto pb-1 md:pb-0 max-w-[calc(100vw-4rem)] md:max-w-xs">
              {selectedRetailers.map(retailer => (
                <Badge 
                  key={retailer} 
                  variant="outline"
                  className="flex items-center whitespace-nowrap gap-1 rounded-full"
                >
                  {retailer}
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      handleRetailerSelect(retailer);
                    }}
                    className="ml-1 rounded-full focus:outline-none focus:ring-2"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </Badge>
              ))}
            </div>
          )}
        </div>
      </div>
      
      {showFilters && (
        <div className="mt-4 p-4 bg-secondary rounded-xl animate-slide-down">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="font-medium mb-2">Brands</h3>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2">
                {retailers.map(retailer => (
                  <button
                    key={retailer}
                    onClick={() => handleRetailerSelect(retailer)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all ${
                      selectedRetailers.includes(retailer)
                        ? 'bg-primary text-white'
                        : 'bg-background hover:bg-background/80'
                    }`}
                  >
                    {retailer}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Industries</h3>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2">
                {industries.map(industry => (
                  <button
                    key={industry}
                    onClick={() => handleIndustrySelect(industry)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all capitalize ${
                      selectedIndustries.includes(industry)
                        ? 'bg-primary text-white'
                        : 'bg-background hover:bg-background/80'
                    }`}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            </div>
            
            <div>
              <h3 className="font-medium mb-2">Notification Types</h3>
              <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto pr-2">
                {notificationTypes.map(type => (
                  <button
                    key={type}
                    onClick={() => handleTypeSelect(type)}
                    className={`px-3 py-1.5 rounded-full text-sm transition-all capitalize ${
                      selectedTypes.includes(type)
                        ? 'bg-primary text-white'
                        : 'bg-background hover:bg-background/80'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterSection;
