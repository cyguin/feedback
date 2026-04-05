import type { FeedbackAdapter, FeedbackRecord } from '../types.js';
import { nanoid } from 'nanoid';

export class InMemoryFeedbackAdapter implements FeedbackAdapter {
  private store: Map<string, FeedbackRecord> = new Map();

  async list(opts?: {
    url?: string;
    reviewed?: boolean;
    limit?: number;
  }): Promise<{ data: FeedbackRecord[]; total: number }> {
    let records = Array.from(this.store.values());

    if (opts?.url !== undefined) {
      records = records.filter((r) => r.url === opts.url);
    }
    if (opts?.reviewed !== undefined) {
      records = records.filter((r) => r.reviewed === opts.reviewed);
    }

    records.sort((a, b) => b.createdAt - a.createdAt);

    if (opts?.limit !== undefined) {
      records = records.slice(0, opts.limit);
    }

    return { data: records, total: records.length };
  }

  async create(record: {
    userId?: string;
    type: import('../types.js').FeedbackType;
    body: string;
    url: string;
    createdAt: number;
  }): Promise<FeedbackRecord> {
    const feedbackRecord: FeedbackRecord = {
      id: nanoid(),
      userId: record.userId,
      type: record.type,
      body: record.body,
      url: record.url,
      createdAt: record.createdAt,
      reviewed: false,
    };
    this.store.set(feedbackRecord.id, feedbackRecord);
    return feedbackRecord;
  }

  async setReviewed(id: string, reviewed: boolean): Promise<FeedbackRecord> {
    const record = this.store.get(id);
    if (!record) {
      throw new Error(`Feedback record ${id} not found`);
    }
    record.reviewed = reviewed;
    return record;
  }
}
