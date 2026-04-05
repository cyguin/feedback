import { NextRequest, NextResponse } from 'next/server';
import { createFeedbackHandler } from '../../handlers/route.js';
import { InMemoryFeedbackAdapter } from '../../adapters/in-memory.js';

const adapter = new InMemoryFeedbackAdapter();
const secret = process.env.FEEDBACK_SECRET ?? '';

const handler = createFeedbackHandler({ adapter, secret });

export async function GET(req: NextRequest) {
  return handler(req);
}

export async function POST(req: NextRequest) {
  return handler(req);
}

export async function PATCH(req: NextRequest) {
  return handler(req);
}
