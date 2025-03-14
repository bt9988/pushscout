
import { useState } from 'react';
import Header from '@/components/Header';
import { Bell, Send, Mail, User, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

const About = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message sent",
      description: "Thanks for reaching out! We'll get back to you soon.",
    });
    
    setName('');
    setEmail('');
    setMessage('');
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="px-6 max-w-4xl mx-auto">
          <section className="mb-16">
            <h1 className="text-3xl md:text-4xl font-bold mb-6">About PushScout</h1>
            
            <div className="prose prose-lg max-w-none">
              <p>
                At PushScout, we're passionate about creating exceptional customer experiences 
                through thoughtful mobile engagement. We believe that push notifications are 
                a powerful tool for connecting with users, but only when done right.
              </p>
              
              <p>
                Our mission is to gather and showcase outstanding examples of push notifications 
                from top brands and applications across various industries. By curating this gallery, 
                we aim to inspire app builders, marketers, product managers, and designers 
                to create more effective, engaging, and respectful mobile communications.
              </p>
              
              <p>
                Whether you're looking to improve customer retention, boost engagement, or simply 
                learn from the best in the business, PushScout is your resource for push notification 
                inspiration and best practices.
              </p>
              
              <p>
                This community-driven platform allows professionals to submit, discover, and learn 
                from real-world notification examples that drive results.
              </p>
            </div>
          </section>
          
          <section className="mb-16">
            <div className="bg-card rounded-xl p-8 border border-border">
              <h2 className="text-2xl font-semibold mb-6">Get in Touch</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <div className="relative">
                      <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                      <Input 
                        id="email"
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="Your email address"
                        className="pl-10"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="message">Message</Label>
                  <div className="relative">
                    <MessageSquare className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Textarea 
                      id="message"
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      placeholder="How can we help you?"
                      className="pl-10 min-h-[120px]"
                      required
                    />
                  </div>
                </div>
                
                <Button 
                  type="submit" 
                  className="w-full sm:w-auto"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>Sending<span className="loading ml-2">...</span></>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>
          </section>
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

export default About;
