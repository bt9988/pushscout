
export type NotificationType = 'promotional' | 'transactional' | 'engagement' | 'informational' | 'update';

export type Industry = 
  'ecommerce' | 
  'finance' | 
  'travel' | 
  'food' | 
  'health' | 
  'technology' | 
  'entertainment' | 
  'education' | 
  'social media' |
  'other';

export interface Notification {
  id: string;
  title: string;
  message: string;
  imageUrl: string;
  retailer: string;
  industry: Industry;
  type: NotificationType;
  submittedBy?: string;
  submittedAt: Date;
  likes?: number;
  views?: number;
}
