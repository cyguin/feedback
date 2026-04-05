export type {
  FeedbackAdapter,
  FeedbackRecord,
  FeedbackType,
} from './types.js';

export { createFeedbackHandler } from './server.js';
export { InMemoryFeedbackAdapter, SupabaseFeedbackAdapter } from './adapters/index.js';

export { FeedbackWidget } from './components/FeedbackWidget.js';
export type { FeedbackWidgetProps, FeedbackData } from './components/FeedbackWidget.js';
