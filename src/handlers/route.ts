import { NextRequest, NextResponse } from 'next/server';
import type { FeedbackAdapter, FeedbackType } from '../types.js';

interface HandlerOptions {
  adapter: FeedbackAdapter;
  secret: string;
}

function parseJsonBody<T>(req: NextRequest): Promise<T> {
  return req.json();
}

function bearerToken(req: NextRequest, secret: string): boolean {
  const auth = req.headers.get('Authorization') ?? '';
  return auth === `Bearer ${secret}`;
}

export function createFeedbackHandler({ adapter, secret }: HandlerOptions) {
  return async function handler(req: NextRequest) {
    const url = req.nextUrl.clone();
    const pathname = url.pathname;
    const segments = pathname.split('/').filter(Boolean);
    const cyguinIndex = segments.indexOf('cyguin');

    if (cyguinIndex === -1) {
      return NextResponse.json({ error: 'Invalid route' }, { status: 400 });
    }

    const remaining = segments.slice(cyguinIndex + 1);

    try {
      if (req.method === 'GET') {
        if (!bearerToken(req, secret)) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const urlParam = url.searchParams.get('url') ?? undefined;
        const reviewedParam = url.searchParams.get('reviewed');
        const limitParam = url.searchParams.get('limit');

        const reviewed =
          reviewedParam !== null
            ? reviewedParam === '1' || reviewedParam === 'true'
            : undefined;
        const limit = limitParam !== null ? parseInt(limitParam, 10) : undefined;

        const result = await adapter.list({ url: urlParam, reviewed, limit });
        return NextResponse.json({ data: result.data, total: result.total });
      }

      if (req.method === 'POST') {
        if (!bearerToken(req, secret)) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await parseJsonBody<{
          type: FeedbackType;
          body: string;
          url: string;
          userId?: string;
        }>(req);

        if (!body.type || !body.body || !body.url) {
          return NextResponse.json(
            { error: 'type, body, and url are required' },
            { status: 400 }
          );
        }

        const record = await adapter.create({
          type: body.type,
          body: body.body,
          url: body.url,
          userId: body.userId,
          createdAt: Date.now(),
        });
        return NextResponse.json({ data: record }, { status: 201 });
      }

      if (req.method === 'PATCH') {
        if (!bearerToken(req, secret)) {
          return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        if (remaining.length < 1) {
          return NextResponse.json({ error: 'id is required' }, { status: 400 });
        }

        const id = remaining[0];
        await adapter.setReviewed(id, true);
        return NextResponse.json({ data: { id, reviewed: true } });
      }

      return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Unknown error';
      return NextResponse.json({ error: message }, { status: 500 });
    }
  };
}
