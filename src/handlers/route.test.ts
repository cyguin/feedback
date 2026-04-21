import { NextRequest } from 'next/server';
import { describe, expect, it, vi } from 'vitest';
import { createFeedbackHandler } from './route';
import type { FeedbackAdapter } from '../types';

function adapter(): FeedbackAdapter {
  return {
    create: vi.fn().mockResolvedValue({
      id: 'fb_1',
      type: 'text',
      body: 'Ship it',
      url: '/pricing',
      createdAt: Date.now(),
      reviewed: false,
    }),
    list: vi.fn().mockResolvedValue({ data: [], total: 0 }),
    setReviewed: vi.fn().mockResolvedValue(undefined),
  };
}

describe('createFeedbackHandler auth', () => {
  it('fails closed when no feedback secret is configured', async () => {
    const feedbackAdapter = adapter();
    const handler = createFeedbackHandler({ adapter: feedbackAdapter });

    const response = await handler(
      new NextRequest('https://example.com/api/cyguin', {
        method: 'GET',
      })
    );

    expect(response.status).toBe(500);
    expect(feedbackAdapter.list).not.toHaveBeenCalled();
  });

  it('allows public feedback submission without an admin secret', async () => {
    const feedbackAdapter = adapter();
    const handler = createFeedbackHandler({ adapter: feedbackAdapter });

    const response = await handler(
      new NextRequest('https://example.com/api/cyguin', {
        method: 'POST',
        body: JSON.stringify({
          type: 'text',
          body: 'Ship it',
          url: '/pricing',
        }),
      })
    );

    expect(response.status).toBe(201);
    expect(feedbackAdapter.create).toHaveBeenCalledWith(
      expect.objectContaining({ type: 'text', body: 'Ship it', url: '/pricing' })
    );
  });

  it('rejects invalid bearer tokens on admin routes', async () => {
    const feedbackAdapter = adapter();
    const handler = createFeedbackHandler({ adapter: feedbackAdapter, secret: 'feedback-secret' });

    const response = await handler(
      new NextRequest('https://example.com/api/cyguin', {
        method: 'PATCH',
        headers: { authorization: 'Bearer wrong' },
      })
    );

    expect(response.status).toBe(401);
    expect(feedbackAdapter.setReviewed).not.toHaveBeenCalled();
  });
});
