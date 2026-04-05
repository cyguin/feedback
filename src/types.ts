export type FeedbackType = 'thumbs' | 'rating' | 'text';

export interface FeedbackRecord {
  id: string;
  userId?: string;
  type: FeedbackType;
  body: string;
  url: string;
  createdAt: number;
  reviewed: boolean;
}

export interface FeedbackAdapter {
  list(opts?: {
    url?: string;
    reviewed?: boolean;
    limit?: number;
  }): Promise<{ data: FeedbackRecord[]; total: number }>;

  create(record: {
    userId?: string;
    type: FeedbackType;
    body: string;
    url: string;
    createdAt: number;
  }): Promise<FeedbackRecord>;

  setReviewed(id: string, reviewed: boolean): Promise<FeedbackRecord>;
}

export interface FeedbackWidgetProps {
  type: 'thumbs' | 'rating' | 'text';
  url?: string;
  userId?: string;
  theme?: 'light' | 'dark';
  className?: string;
  onSubmit?: (feedback: FeedbackData) => void;
  maxStars?: number;
  placeholder?: string;
}

export interface FeedbackData {
  id: string;
  userId?: string;
  type: FeedbackType;
  body: string;
  url: string;
  createdAt: number;
  reviewed: boolean;
}
