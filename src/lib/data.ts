import { Notification, Industry, NotificationType } from '@/types';

export const mockNotifications: Notification[] = [
  {
    id: '1',
    title: 'Flash Sale',
    message: "Limited time! 50% off all summer styles. Shop now before they're gone!",
    imageUrl: 'https://picsum.photos/seed/n1/800/600',
    retailer: 'Zara',
    industry: 'ecommerce',
    type: 'promotional',
    submittedBy: 'sarah.marketing',
    submittedAt: new Date('2023-06-10'),
    likes: 42,
    views: 1204
  },
  {
    id: '2',
    title: 'Order Shipped',
    message: 'Your order #12345 has been shipped and will arrive in 2-3 business days.',
    imageUrl: 'https://picsum.photos/seed/n2/800/600',
    retailer: 'Amazon',
    industry: 'ecommerce',
    type: 'transactional',
    submittedBy: 'james.ecom',
    submittedAt: new Date('2023-06-08'),
    likes: 18,
    views: 532
  },
  {
    id: '3',
    title: 'New Episode Available',
    message: 'The latest episode of "The Crown" is now available to stream. Watch now!',
    imageUrl: 'https://picsum.photos/seed/n3/800/600',
    retailer: 'Netflix',
    industry: 'entertainment',
    type: 'informational',
    submittedBy: 'media.team',
    submittedAt: new Date('2023-06-07'),
    likes: 87,
    views: 2103
  },
  {
    id: '4',
    title: 'Account Security',
    message: 'We noticed a login from a new device. Was this you?',
    imageUrl: 'https://picsum.photos/seed/n4/800/600',
    retailer: 'Bank of America',
    industry: 'finance',
    type: 'transactional',
    submittedBy: 'secure.banking',
    submittedAt: new Date('2023-06-05'),
    likes: 12,
    views: 840
  },
  {
    id: '5',
    title: 'Weekend Special',
    message: 'Free delivery all weekend! Order your favorite meal now.',
    imageUrl: 'https://picsum.photos/seed/n5/800/600',
    retailer: 'DoorDash',
    industry: 'food',
    type: 'promotional',
    submittedBy: 'marketing.dd',
    submittedAt: new Date('2023-06-04'),
    likes: 56,
    views: 1876
  },
  {
    id: '6',
    title: 'Flight Check-in',
    message: 'Your flight departs in 24 hours. Check in now to save time at the airport.',
    imageUrl: 'https://picsum.photos/seed/n6/800/600',
    retailer: 'United Airlines',
    industry: 'travel',
    type: 'transactional',
    submittedBy: 'united.notifications',
    submittedAt: new Date('2023-06-02'),
    likes: 34,
    views: 921
  },
  {
    id: '7',
    title: 'App Update Available',
    message: 'Version 2.0 is here with new features and improvements!',
    imageUrl: 'https://picsum.photos/seed/n7/800/600',
    retailer: 'Spotify',
    industry: 'technology',
    type: 'update',
    submittedBy: 'tech.updates',
    submittedAt: new Date('2023-06-01'),
    likes: 75,
    views: 1562
  },
  {
    id: '8',
    title: 'Workout Reminder',
    message: 'Time for your daily workout! 7 minutes is all you need.',
    imageUrl: 'https://picsum.photos/seed/n8/800/600',
    retailer: 'Fitness+',
    industry: 'health',
    type: 'engagement',
    submittedBy: 'health.coach',
    submittedAt: new Date('2023-05-30'),
    likes: 49,
    views: 1103
  }
];

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
  'other'
];

export const notificationTypes: NotificationType[] = [
  'promotional',
  'transactional',
  'engagement',
  'informational',
  'update'
];

export const getUniqueRetailers = (): string[] => {
  return Array.from(new Set(mockNotifications.map(n => n.retailer))).sort();
};

export const getNotificationById = (id: string): Notification | undefined => {
  return mockNotifications.find(n => n.id === id);
};
