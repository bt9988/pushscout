
export type NotificationType = 
  'promotional' | 
  'transactional' | 
  'engagement' | 
  'informational' | 
  'update' |
  'reminder' |
  'feedback' |
  'alert' |
  'onboarding' |
  'achievement';

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
  'fitness' | 
  'beauty' | 
  'automotive' | 
  'real estate' | 
  'gaming' | 
  'utilities' | 
  'non-profit' | 
  'government' | 
  'news' | 
  'sports' |
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
