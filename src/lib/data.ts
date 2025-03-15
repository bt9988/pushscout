import { Notification, Industry, NotificationType } from '@/types';

// Approved notifications
export let mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Flash Sale',
    message: "Limited time! 50% off all summer styles. Shop now before they're gone!",
    imageUrl: '/images/push1.png',
    retailer: 'Zara',
    industry: 'ecommerce',
    type: 'promotional',
    submittedBy: 'sarah.marketing',
    submittedAt: new Date('2023-06-10'),
    likes: 42,
    views: 1204,
    approved: true
  },
  {
    id: '2',
    title: 'Order Shipped',
    message: 'Your order #12345 has been shipped and will arrive in 2-3 business days.',
    imageUrl: '/images/push2.png',
    retailer: 'Amazon',
    industry: 'ecommerce',
    type: 'transactional',
    submittedBy: 'james.ecom',
    submittedAt: new Date('2023-06-08'),
    likes: 18,
    views: 532,
    approved: true
  },
  {
    id: '3',
    title: 'New Episode Available',
    message: 'The latest episode of "The Crown" is now available to stream. Watch now!',
    imageUrl: '/images/push3.png',
    retailer: 'Netflix',
    industry: 'entertainment',
    type: 'informational',
    submittedBy: 'media.team',
    submittedAt: new Date('2023-06-07'),
    likes: 87,
    views: 2103,
    approved: true
  },
  {
    id: '4',
    title: 'Account Security',
    message: 'We noticed a login from a new device. Was this you?',
    imageUrl: '/images/push4.png',
    retailer: 'Bank of America',
    industry: 'finance',
    type: 'transactional',
    submittedBy: 'secure.banking',
    submittedAt: new Date('2023-06-05'),
    likes: 12,
    views: 840,
    approved: true
  },
  {
    id: '5',
    title: 'Weekend Special',
    message: 'Free delivery all weekend! Order your favorite meal now.',
    imageUrl: '/images/push1.png',
    retailer: 'DoorDash',
    industry: 'food',
    type: 'promotional',
    submittedBy: 'marketing.dd',
    submittedAt: new Date('2023-06-04'),
    likes: 56,
    views: 1876,
    approved: true
  },
  {
    id: '6',
    title: 'Flight Check-in',
    message: 'Your flight departs in 24 hours. Check in now to save time at the airport.',
    imageUrl: '/images/push2.png',
    retailer: 'United Airlines',
    industry: 'travel',
    type: 'transactional',
    submittedBy: 'united.notifications',
    submittedAt: new Date('2023-06-02'),
    likes: 34,
    views: 921,
    approved: true
  },
  {
    id: '7',
    title: 'App Update Available',
    message: 'Version 2.0 is here with new features and improvements!',
    imageUrl: '/images/push3.png',
    retailer: 'Spotify',
    industry: 'technology',
    type: 'update',
    submittedBy: 'tech.updates',
    submittedAt: new Date('2023-06-01'),
    likes: 75,
    views: 1562,
    approved: true
  },
  {
    id: '8',
    title: 'Workout Reminder',
    message: 'Time for your daily workout! 7 minutes is all you need.',
    imageUrl: '/images/push4.png',
    retailer: 'Fitness+',
    industry: 'health',
    type: 'engagement',
    submittedBy: 'health.coach',
    submittedAt: new Date('2023-05-30'),
    likes: 49,
    views: 1103,
    approved: true
  }
];

// Initialize pending notifications array
export let pendingNotifications: Notification[] = [];

// Add a notification to the pending queue instead of directly to mockNotifications
export const addNotification = (notification: Notification) => {
  const newId = String(Math.max(...mockNotifications.map(n => parseInt(n.id)), 
                         ...pendingNotifications.map(n => parseInt(n.id)), 0) + 1);
  
  notification.id = newId;
  notification.approved = false; // Mark as unapproved by default
  
  pendingNotifications = [notification, ...pendingNotifications];
  
  try {
    // Store pending notifications separately
    const storedPendingNotifications = localStorage.getItem('pushscout_pending_notifications');
    const pendingArray = storedPendingNotifications ? JSON.parse(storedPendingNotifications) : [];
    pendingArray.push(notification);
    localStorage.setItem('pushscout_pending_notifications', JSON.stringify(pendingArray));
  } catch (error) {
    console.error('Error saving pending notification to localStorage:', error);
  }
  
  return notification;
};

// Approve a notification and move it from pending to approved
export const approveNotification = (id: string) => {
  const notificationIndex = pendingNotifications.findIndex(n => n.id === id);
  
  if (notificationIndex !== -1) {
    const notification = pendingNotifications[notificationIndex];
    notification.approved = true;
    
    // Remove from pending
    pendingNotifications.splice(notificationIndex, 1);
    
    // Add to approved
    mockNotifications = [notification, ...mockNotifications];
    
    // Update localStorage
    try {
      // Update approved notifications
      const storedNotifications = localStorage.getItem('pushscout_notifications');
      const notificationsArray = storedNotifications ? JSON.parse(storedNotifications) : [];
      notificationsArray.push(notification);
      localStorage.setItem('pushscout_notifications', JSON.stringify(notificationsArray));
      
      // Update pending notifications
      localStorage.setItem('pushscout_pending_notifications', JSON.stringify(pendingNotifications));
    } catch (error) {
      console.error('Error updating localStorage:', error);
    }
    
    return true;
  }
  
  return false;
};

// Delete a notification (from either pending or approved)
export const deleteNotification = (id: string) => {
  // Check pending notifications first
  const pendingIndex = pendingNotifications.findIndex(n => n.id === id);
  if (pendingIndex !== -1) {
    pendingNotifications.splice(pendingIndex, 1);
    
    // Update localStorage
    try {
      localStorage.setItem('pushscout_pending_notifications', JSON.stringify(pendingNotifications));
    } catch (error) {
      console.error('Error updating localStorage:', error);
    }
    
    return true;
  }
  
  // Then check approved notifications
  const approvedIndex = mockNotifications.findIndex(n => n.id === id);
  if (approvedIndex !== -1) {
    mockNotifications.splice(approvedIndex, 1);
    
    // Update localStorage
    try {
      localStorage.setItem('pushscout_notifications', JSON.stringify(mockNotifications));
    } catch (error) {
      console.error('Error updating localStorage:', error);
    }
    
    return true;
  }
  
  return false;
};

// Load both approved and pending notifications from localStorage
export const loadStoredNotifications = () => {
  try {
    // Load approved notifications
    const storedNotifications = localStorage.getItem('pushscout_notifications');
    if (storedNotifications) {
      const parsedNotifications = JSON.parse(storedNotifications);
      
      const processedNotifications = parsedNotifications.map((notification: any) => ({
        ...notification,
        submittedAt: new Date(notification.submittedAt),
        approved: true
      }));
      
      processedNotifications.forEach((notification: Notification) => {
        if (!mockNotifications.some(n => n.id === notification.id)) {
          mockNotifications.unshift(notification);
        }
      });
    }
    
    // Load pending notifications
    const storedPendingNotifications = localStorage.getItem('pushscout_pending_notifications');
    if (storedPendingNotifications) {
      const parsedPendingNotifications = JSON.parse(storedPendingNotifications);
      
      const processedPendingNotifications = parsedPendingNotifications.map((notification: any) => ({
        ...notification,
        submittedAt: new Date(notification.submittedAt),
        approved: false
      }));
      
      pendingNotifications = processedPendingNotifications;
    }
  } catch (error) {
    console.error('Error loading notifications from localStorage:', error);
  }
};

export const industries: Industry[] = [
  'ecommerce',
  'finance',
  'travel',
  'food',
  'health',
  'technology',
  'entertainment',
  'education',
  'social media',
  'fitness',
  'beauty',
  'automotive',
  'real estate',
  'gaming',
  'utilities',
  'non-profit',
  'government',
  'news',
  'sports',
  'other'
];

export const notificationTypes: NotificationType[] = [
  'promotional',
  'transactional',
  'engagement',
  'informational',
  'update',
  'reminder',
  'feedback',
  'alert',
  'onboarding',
  'achievement'
];

export const getUniqueRetailers = (): string[] => {
  return Array.from(new Set(mockNotifications.map(n => n.retailer))).sort();
};

export const getNotificationById = (id: string): Notification | undefined => {
  return mockNotifications.find(n => n.id === id) || pendingNotifications.find(n => n.id === id);
};
