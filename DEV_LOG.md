# @cyguin/feedback — Dev Log

## Slice 1 — Feedback API + Adapters (COMPLETE)
- [x] `src/types.ts` — FeedbackType, FeedbackRecord, FeedbackAdapter, FeedbackWidgetProps, FeedbackData
- [x] `src/adapters/in-memory.ts` — InMemoryFeedbackAdapter (implements FeedbackAdapter)
- [x] `src/adapters/supabase.ts` — SupabaseFeedbackAdapter (implements FeedbackAdapter)
- [x] `src/adapters/index.ts` — re-exports adapters
- [x] `src/handlers/route.ts` — createFeedbackHandler factory (GET/POST/PATCH)
- [x] `src/server.ts` — re-exports createFeedbackHandler

## Slice 2 — FeedbackWidget Component + README + Package Config (COMPLETE)
- [x] `src/components/FeedbackWidget.tsx` — three-mode widget (thumbs/rating/text)
- [x] `src/components/index.ts` — exports FeedbackWidget, types
- [x] `src/index.ts` — re-exports FeedbackWidget + types
- [x] `package.json` — full exports map, peerDeps
- [x] `tsconfig.json` — standard Next.js package tsconfig
- [x] `tsup.config.ts` — dual ESM/CJS, multi-entry
- [x] `README.md` — quickstart, all three modes, theming, Supabase adapter setup
