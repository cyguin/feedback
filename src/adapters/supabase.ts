import type { FeedbackAdapter, FeedbackRecord } from '../types.js';
import type { SupabaseClient } from '@supabase/supabase-js';
import { nanoid } from 'nanoid';

export class SupabaseFeedbackAdapter implements FeedbackAdapter {
  private client: SupabaseClient;
  private tableName: string;

  constructor(client: SupabaseClient, tableName = 'feedback') {
    this.client = client;
    this.tableName = tableName;
  }

  private mapRow(row: Record<string, unknown>): FeedbackRecord {
    return {
      id: row.id as string,
      userId: row.user_id as string | undefined,
      type: row.type as import('../types.js').FeedbackType,
      body: row.body as string,
      url: row.url as string,
      createdAt: row.created_at as number,
      reviewed: Boolean(row.reviewed),
    };
  }

  async list(opts?: {
    url?: string;
    reviewed?: boolean;
    limit?: number;
  }): Promise<{ data: FeedbackRecord[]; total: number }> {
    let query = this.client.from(this.tableName).select('*', { count: 'exact' });

    if (opts?.url !== undefined) {
      query = query.eq('url', opts.url);
    }
    if (opts?.reviewed !== undefined) {
      query = query.eq('reviewed', opts.reviewed ? 1 : 0);
    }

    query = query.order('created_at', { ascending: false });

    if (opts?.limit !== undefined) {
      query = query.limit(opts.limit);
    }

    const { data, count, error } = await query;

    if (error) throw error;
    return { data: (data ?? []).map((r: Record<string, unknown>) => this.mapRow(r)), total: count ?? 0 };
  }

  async create(record: {
    userId?: string;
    type: import('../types.js').FeedbackType;
    body: string;
    url: string;
    createdAt: number;
  }): Promise<FeedbackRecord> {
    const { data, error } = await this.client
      .from(this.tableName)
      .insert({
        id: nanoid(),
        user_id: record.userId ?? null,
        type: record.type,
        body: record.body,
        url: record.url,
        created_at: record.createdAt,
        reviewed: 0,
      })
      .select()
      .single();

    if (error) throw error;
    return this.mapRow(data as Record<string, unknown>);
  }

  async setReviewed(id: string, reviewed: boolean): Promise<FeedbackRecord> {
    const { data, error } = await this.client
      .from(this.tableName)
      .update({ reviewed: reviewed ? 1 : 0 })
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return this.mapRow(data as Record<string, unknown>);
  }
}
