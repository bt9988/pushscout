import { Notification } from '@/types';

// Function to load stored notifications from localStorage
export const loadStoredNotifications = (): Notification[] => {
  const storedNotifications = localStorage.getItem('notifications');
  if (storedNotifications) {
    try {
      return JSON.parse(storedNotifications) as Notification[];
    } catch (error) {
      console.error("Error parsing stored notifications:", error);
      return [];
    }
  }
  return [];
};

// Function to get a notification by ID
export const getNotificationById = (id: string): Notification | undefined => {
  const notifications = loadStoredNotifications();
  return notifications.find(notification => notification.id === id);
};

export const updateNotification = (updatedNotification: Notification): void => {
  // Get current notifications from localStorage
  const storedNotifications = localStorage.getItem('notifications');
  if (storedNotifications) {
    const notifications = JSON.parse(storedNotifications) as Notification[];
    
    // Find and update the notification
    const index = notifications.findIndex(n => n.id === updatedNotification.id);
    if (index !== -1) {
      notifications[index] = updatedNotification;
      localStorage.setItem('notifications', JSON.stringify(notifications));
    }
  }
  
  // Also update pending notifications if needed
  const storedPendingNotifications = localStorage.getItem('pendingNotifications');
  if (storedPendingNotifications) {
    const pendingNotifications = JSON.parse(storedPendingNotifications) as Notification[];
    
    // Find and update the notification
    const index = pendingNotifications.findIndex(n => n.id === updatedNotification.id);
    if (index !== -1) {
      pendingNotifications[index] = updatedNotification;
      localStorage.setItem('pendingNotifications', JSON.stringify(pendingNotifications));
    }
  }
};

// Sample arrays for industries and notification types
export const industries = [
  'ecommerce', 'finance', 'travel', 'food', 'health', 'technology',
  'entertainment', 'education', 'social media', 'fitness', 'beauty',
  'automotive', 'real estate', 'gaming', 'utilities', 'non-profit',
  'government', 'news', 'sports', 'other'
];

export const notificationTypes = [
  'promotional', 'transactional', 'engagement', 'informational',
  'update', 'reminder', 'feedback', 'alert', 'onboarding', 'achievement'
];

// Add tracking to our data functions
export const addNotification = (notification: Notification): void => {
  // Add to the pendingNotifications array in localStorage  
  const storedPendingNotifications = localStorage.getItem('pendingNotifications');
  let pendingNotifications = [];
  
  if (storedPendingNotifications) {
    pendingNotifications = JSON.parse(storedPendingNotifications);
  }
  
  pendingNotifications.push(notification);
  localStorage.setItem('pendingNotifications', JSON.stringify(pendingNotifications));
  
  // Track submission in Google Analytics
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', 'notification_submission', {
      notification_id: notification.id,
      notification_title: notification.title,
      industry: notification.industry,
      type: notification.type
    });
  }
};
