
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import Header from '@/components/Header';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Binoculars, CheckCircle, Trash2, Eye, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { mockNotifications, pendingNotifications, approveNotification, deleteNotification } from '@/lib/data';
import { Notification } from '@/types';

const ADMIN_PASSWORD = 'pushscout2024'; // Simple password for demo purposes

const Admin = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [pendingNotifs, setPendingNotifs] = useState<Notification[]>([]);
  const [activeTab, setActiveTab] = useState('pending');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedNotification, setSelectedNotification] = useState<Notification | null>(null);
  const [dialogAction, setDialogAction] = useState<'approve' | 'delete'>('approve');

  useEffect(() => {
    // Check if admin is already authenticated
    const isAuth = localStorage.getItem('admin_authenticated') === 'true';
    setAuthenticated(isAuth);
    
    // Update notifications lists
    setNotifications([...mockNotifications]);
    setPendingNotifs([...pendingNotifications]);
  }, []);

  const handleLogin = () => {
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true);
      localStorage.setItem('admin_authenticated', 'true');
      toast({
        title: "Authenticated",
        description: "Welcome to the admin dashboard",
      });
    } else {
      toast({
        title: "Authentication failed",
        description: "Incorrect password",
        variant: "destructive",
      });
    }
  };

  const handleLogout = () => {
    setAuthenticated(false);
    localStorage.removeItem('admin_authenticated');
    navigate('/');
  };

  const openApproveDialog = (notification: Notification) => {
    setSelectedNotification(notification);
    setDialogAction('approve');
    setDialogOpen(true);
  };

  const openDeleteDialog = (notification: Notification) => {
    setSelectedNotification(notification);
    setDialogAction('delete');
    setDialogOpen(true);
  };

  const confirmAction = () => {
    if (!selectedNotification) return;
    
    if (dialogAction === 'approve') {
      if (approveNotification(selectedNotification.id)) {
        toast({
          title: "Notification approved",
          description: "The notification has been published to the gallery",
        });
        // Update the lists
        setNotifications([...mockNotifications]);
        setPendingNotifs([...pendingNotifications]);
      }
    } else if (dialogAction === 'delete') {
      if (deleteNotification(selectedNotification.id)) {
        toast({
          title: "Notification deleted",
          description: "The notification has been removed",
        });
        // Update the lists
        setNotifications([...mockNotifications]);
        setPendingNotifs([...pendingNotifications]);
      }
    }
    
    setDialogOpen(false);
  };

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  if (!authenticated) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Header />
        
        <main className="flex-1 pt-24 pb-12">
          <div className="px-6 max-w-md mx-auto">
            <Card className="border border-border shadow-sm">
              <CardHeader>
                <CardTitle className="text-2xl">Admin Login</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label htmlFor="password" className="text-sm font-medium">
                      Password
                    </label>
                    <input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full px-3 py-2 border rounded-md"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          handleLogin();
                        }
                      }}
                    />
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button onClick={handleLogin} className="w-full">
                  Login
                </Button>
              </CardFooter>
            </Card>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header />
      
      <main className="flex-1 pt-24 pb-12">
        <div className="px-6 max-w-7xl mx-auto">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <Button variant="outline" onClick={handleLogout}>
              Logout
            </Button>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="pending" className="relative">
                Pending Notifications
                {pendingNotifs.length > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {pendingNotifs.length}
                  </span>
                )}
              </TabsTrigger>
              <TabsTrigger value="approved">Published Notifications</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pending">
              {pendingNotifs.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No pending notifications to review</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Retailer</TableHead>
                        <TableHead>Submitted By</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingNotifs.map((notification) => (
                        <TableRow key={notification.id}>
                          <TableCell className="font-medium">{notification.title}</TableCell>
                          <TableCell>{notification.retailer}</TableCell>
                          <TableCell>{notification.submittedBy}</TableCell>
                          <TableCell>{formatDate(notification.submittedAt)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                title="View details"
                              >
                                <Link to={`/notification/${notification.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openApproveDialog(notification)}
                                title="Approve"
                              >
                                <CheckCircle className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteDialog(notification)}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
            
            <TabsContent value="approved">
              {notifications.length === 0 ? (
                <div className="text-center py-10">
                  <p className="text-muted-foreground">No published notifications</p>
                </div>
              ) : (
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Title</TableHead>
                        <TableHead>Retailer</TableHead>
                        <TableHead>Submitted By</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {notifications.map((notification) => (
                        <TableRow key={notification.id}>
                          <TableCell className="font-medium">{notification.title}</TableCell>
                          <TableCell>{notification.retailer}</TableCell>
                          <TableCell>{notification.submittedBy}</TableCell>
                          <TableCell>{formatDate(notification.submittedAt)}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                asChild
                                title="View details"
                              >
                                <Link to={`/notification/${notification.id}`}>
                                  <Eye className="h-4 w-4" />
                                </Link>
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => openDeleteDialog(notification)}
                                title="Delete"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {dialogAction === 'approve' ? 'Approve Notification' : 'Delete Notification'}
            </DialogTitle>
            <DialogDescription>
              {dialogAction === 'approve'
                ? 'This will publish the notification to the gallery.'
                : 'This will permanently remove the notification.'}
            </DialogDescription>
          </DialogHeader>
          
          {selectedNotification && (
            <div className="py-4">
              <h3 className="font-medium">{selectedNotification.title}</h3>
              <p className="text-sm text-muted-foreground mt-1">{selectedNotification.message}</p>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              onClick={confirmAction}
              variant={dialogAction === 'delete' ? 'destructive' : 'default'}
            >
              {dialogAction === 'approve' ? 'Approve' : 'Delete'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
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
              <Link to="/admin" className="text-sm text-muted-foreground hover:text-foreground transition-colors">Admin</Link>
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

export default Admin;
