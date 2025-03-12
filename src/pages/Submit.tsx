
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
import { Upload, Image as ImageIcon, Bell } from 'lucide-react';
import { industries, notificationTypes, mockNotifications } from '@/lib/data';
import { Industry, NotificationType, Notification } from '@/types';

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
  
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "Image too large",
          description: "Please select an image under 5MB",
          variant: "destructive",
        });
        return;
      }
      
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
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
      // Create a new notification object
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
      
      // In a real app, we would make an API call here
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // For demo purposes, we'll navigate to the detail page with the new ID
      toast({
        title: "Successfully submitted!",
        description: "Your notification has been added to the gallery",
      });
      
      // In a real app with backend, we would redirect to the newly created notification
      // For demo, we'll redirect to the home page
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
                  {/* Image Upload */}
                  <div className="md:col-span-2">
                    <Label htmlFor="image" className="block mb-2">
                      Notification Screenshot <span className="text-red-500">*</span>
                    </Label>
                    
                    <div className="border-2 border-dashed rounded-lg p-6 border-muted-foreground/20 hover:border-muted-foreground/30 transition-colors">
                      {previewImage ? (
                        <div className="relative">
                          <img 
                            src={previewImage} 
                            alt="Notification preview" 
                            className="max-h-60 mx-auto rounded-md object-contain"
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            className="mt-4"
                            onClick={() => setPreviewImage(null)}
                          >
                            Change Image
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-4">
                          <div className="mb-4 rounded-full bg-background p-3">
                            <ImageIcon className="h-8 w-8 text-muted-foreground" />
                          </div>
                          <p className="mb-2 text-sm font-medium">
                            Drag and drop or click to upload
                          </p>
                          <p className="text-xs text-muted-foreground">
                            PNG, JPG or WEBP (max. 5MB)
                          </p>
                          <Input 
                            id="image"
                            type="file" 
                            accept="image/*"
                            className="hidden" 
                            onChange={handleImageChange}
                          />
                          <Button
                            type="button"
                            variant="secondary"
                            className="mt-4"
                            onClick={() => document.getElementById('image')?.click()}
                          >
                            <Upload className="h-4 w-4 mr-2" />
                            Select Image
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Title & Message */}
                  <div className="space-y-4 md:col-span-2">
                    <div>
                      <Label htmlFor="title" className="block mb-2">
                        Notification Title <span className="text-red-500">*</span>
                      </Label>
                      <Input 
                        id="title"
                        name="title"
                        placeholder="Enter the notification title"
                        value={formData.title}
                        onChange={handleInputChange}
                      />
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
                    </div>
                  </div>
                  
                  {/* Retailer & Industry */}
                  <div>
                    <Label htmlFor="retailer" className="block mb-2">
                      Retailer / Company <span className="text-red-500">*</span>
                    </Label>
                    <Input 
                      id="retailer"
                      name="retailer"
                      placeholder="e.g. Amazon, Netflix"
                      value={formData.retailer}
                      onChange={handleInputChange}
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
                  
                  {/* Type & Submitted By */}
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
      
      {/* Footer */}
      <footer className="py-8 border-t border-border">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-1 mb-4 md:mb-0">
              <Bell className="w-5 h-5 text-primary" />
              <span className="text-lg font-semibold">PushGallery</span>
            </div>
            <div className="flex space-x-6">
              <a href="/" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Home</a>
              <a href="/submit" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Submit</a>
              <a href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">About</a>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} PushGallery. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Submit;
