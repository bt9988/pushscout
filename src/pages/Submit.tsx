
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Bell } from 'lucide-react';
import { industries, notificationTypes, mockNotifications, addNotification } from '@/lib/data';
import { Industry, NotificationType, Notification } from '@/types';
import ImageCropper from '@/components/ImageCropper';
import BrandAutocomplete from '@/components/BrandAutocomplete';

const Submit = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    message: '',
    retailer: '',
    submittedBy: '',
    industry: '' as Industry,
    type: '' as NotificationType,
  });
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleRetailerChange = (value: string) => {
    setFormData(prev => ({ ...prev, retailer: value }));
  };
  
  const handleImageChange = (croppedImage: string | null, extractedText?: string) => {
    setPreviewImage(croppedImage);
    if (extractedText) {
      setFormData(prev => ({ ...prev, message: extractedText }));
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!previewImage) {
      toast({
        title: "Missing image",
        description: "Please upload a screenshot of the notification",
        variant: "destructive",
      });
      return;
    }
    
    const requiredFields = ['title', 'message', 'retailer', 'industry', 'type'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      toast({
        title: "Missing information",
        description: `Please fill in all required fields: ${missingFields.join(', ')}`,
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const newNotification: Notification = {
        id: `${mockNotifications.length + 1}`,
        title: formData.title,
        message: formData.message,
        imageUrl: previewImage || "https://picsum.photos/seed/default/800/600",
        retailer: formData.retailer,
        industry: formData.industry,
        type: formData.type,
        submittedBy: formData.submittedBy || "Anonymous",
        submittedAt: new Date(),
        likes: 0,
        views: 1
      };
      
      // Add the notification to the mockNotifications array
      addNotification(newNotification);
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Successfully submitted!",
        description: "Your notification has been added to the gallery",
      });
      
      navigate('/');
    } catch (error) {
      toast({
        title: "Submission failed",
        description: "There was a problem submitting your notification",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="px-6 max-w-4xl mx-auto">
          <div className="mb-10 text-center animate-fade-in">
            <h1 className="text-3xl font-bold mb-3">Submit a Notification</h1>
            <p className="text-muted-foreground max-w-2xl mx-auto">
              Share a great push notification example with the community. 
              Please provide a screenshot and details about the notification.
            </p>
          </div>
          
          <Card className="border border-border shadow-sm animate-slide-up">
            <CardHeader>
              <CardTitle>Notification Details</CardTitle>
              <CardDescription>
                Complete the form below to submit a new push notification to the gallery.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
                  <div className="md:col-span-2">
                    <ImageCropper onImageChange={handleImageChange} />
                  </div>
                  
                  <div className="space-y-4 md:col-span-2">
                    <div>
                      <Label htmlFor="title" className="block mb-2">
                        Notification Title <span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        id="title"
                        name="title"
                        placeholder="What is the notification about? (e.g., 'Flash Sale', 'Order Shipped')"
                        value={formData.title}
                        onChange={handleInputChange}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        A short, descriptive title summarizing the purpose of the notification
                      </p>
                    </div>
                    
                    <div>
                      <Label htmlFor="message" className="block mb-2">
                        Notification Message <span className="text-red-500">*</span>
                      </Label>
                      <Textarea 
                        id="message"
                        name="message"
                        placeholder="Enter the notification message content"
                        rows={3}
                        value={formData.message}
                        onChange={handleInputChange}
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        {previewImage ? "Text was extracted from your image. You can edit it if needed." : "The full text content of the notification - we'll try to extract this from your screenshot"}
                      </p>
                    </div>
                  </div>
                  
                  <div>
                    <BrandAutocomplete 
                      value={formData.retailer}
                      onChange={handleRetailerChange}
                      required={true}
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="industry" className="block mb-2">
                      Industry <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.industry}
                      onValueChange={(value) => handleSelectChange('industry', value)}
                    >
                      <SelectTrigger id="industry">
                        <SelectValue placeholder="Select industry" />
                      </SelectTrigger>
                      <SelectContent>
                        {industries.map((industry) => (
                          <SelectItem key={industry} value={industry} className="capitalize">
                            {industry}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="type" className="block mb-2">
                      Notification Type <span className="text-red-500">*</span>
                    </Label>
                    <Select
                      value={formData.type}
                      onValueChange={(value) => handleSelectChange('type', value)}
                    >
                      <SelectTrigger id="type">
                        <SelectValue placeholder="Select type" />
                      </SelectTrigger>
                      <SelectContent>
                        {notificationTypes.map((type) => (
                          <SelectItem key={type} value={type} className="capitalize">
                            {type}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="submittedBy" className="block mb-2">
                      Submitted By (Optional)
                    </Label>
                    <Input 
                      id="submittedBy"
                      name="submittedBy"
                      placeholder="Your name or username"
                      value={formData.submittedBy}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                
                <div className="flex justify-end pt-4">
                  <Button type="submit" disabled={isSubmitting} className="w-full md:w-auto">
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <div className="w-4 h-4 mr-2 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        Submitting...
                      </div>
                    ) : (
                      'Submit Notification'
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>
      
      <footer className="py-8 border-t border-border">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-1 mb-4 md:mb-0">
              <Bell className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold">PushScout</span>
            </div>
            <div className="flex space-x-6">
              <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</a>
              <a href="/submit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Submit</a>
              <a href="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
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

export default Submit;
