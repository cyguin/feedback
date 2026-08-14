> **This package is no longer actively maintained.** cyguin has narrowed focus to security research (PSCryptoPatterns, PSCertPatterns, PSCMSPatterns). Existing published versions remain on npm and MIT-licensed, but no further releases are planned. See cyguin.com for current work.

# @cyguin/feedback

Drop-in feedback widget for Next.js. Thumbs, stars, or free text — capture it from any page.

## Install

```bash
npm install @cyguin/feedback
```

## Setup

### 1. Create the API route

`app/api/feedback/[...cyguin]/route.ts`:

```ts
import { createFeedbackHandler } from '@cyguin/feedback/server';
import { createInMemoryAdapter } from '@cyguin/feedback/adapters/in-memory';

const adapter = createInMemoryAdapter();
const handler = createFeedbackHandler({
  adapter,
  secret: process.env.FEEDBACK_SECRET,
});

export { handler as GET, handler as POST, handler as PATCH };
```

For production with Supabase:

```ts
import { createFeedbackHandler } from '@cyguin/feedback/server';
import { createSupabaseAdapter } from '@cyguin/feedback/adapters/supabase';

const adapter = createSupabaseAdapter(supabaseClient);
const handler = createFeedbackHandler({
  adapter,
  secret: process.env.FEEDBACK_SECRET,
});

export { handler as GET, handler as POST, handler as PATCH };
```

### 2. Run migrations

```sql
CREATE TABLE feedback (
  id TEXT PRIMARY KEY,
  user_id TEXT,
  type TEXT NOT NULL,
  body TEXT NOT NULL,
  url TEXT NOT NULL,
  created_at INTEGER NOT NULL,
  reviewed INTEGER NOT NULL DEFAULT 0
);
```

### 3. Add the widget

```tsx
import { FeedbackWidget } from '@cyguin/feedback/react';

// Thumbs mode
<FeedbackWidget type="thumbs" />

// Star rating (default 5 stars)
<FeedbackWidget type="rating" maxStars={5} />

// Free text
<FeedbackWidget type="text" placeholder="Share your feedback..." />
```

All three modes submit to your API and show a "Thanks for your feedback!" confirmation for 3 seconds.

## Theming

The widget is dark by default. Use `theme="light"` to swap. Override `--cyguin-*` variables on `.feedback-widget`:

```css
.feedback-widget {
  --cyguin-bg: #ffffff;
  --cyguin-bg-subtle: #f5f5f5;
  --cyguin-border: #e5e5e5;
  --cyguin-border-focus: #f5a800;
  --cyguin-fg: #0a0a0a;
  --cyguin-fg-muted: #888888;
  --cyguin-accent: #f5a800;
  --cyguin-accent-dark: #c47f00;
  --cyguin-accent-fg: #0a0a0a;
  --cyguin-radius: 6px;
  --cyguin-shadow: 0 1px 4px rgba(0,0,0,0.08);
}
```

In dark mode these swap automatically:

```css
--cyguin-bg: #0a0a0a;
--cyguin-bg-subtle: #1a1a1a;
--cyguin-border: #2a2a2a;
--cyguin-fg: #f5f5f5;
--cyguin-shadow: 0 1px 4px rgba(0,0,0,0.4);
```

## Supabase Adapter Setup

```ts
import { createFeedbackHandler } from '@cyguin/feedback/server';
import { createSupabaseAdapter } from '@cyguin/feedback/adapters/supabase';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!);
const adapter = createSupabaseAdapter(supabase);

const handler = createFeedbackHandler({
  adapter,
  secret: process.env.FEEDBACK_SECRET,
});

export { handler as GET, handler as POST, handler as PATCH };
```

Admin routes need `FEEDBACK_SECRET` — a Bearer token for listing and reviewing feedback. Public submission doesn't use it.

## API Routes

| Method | Route | Description |
|--------|-------|-------------|
| GET | `/api/feedback` | List feedback (admin, Bearer token required) |
| POST | `/api/feedback` | Submit feedback (public) |
| PATCH | `/api/feedback/:id/reviewed` | Toggle reviewed flag |

## License

MIT
