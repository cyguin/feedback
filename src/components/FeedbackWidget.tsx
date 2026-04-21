'use client';

import { useState, useCallback } from 'react';
import type { FeedbackWidgetProps, FeedbackData } from '../types.js';

export type { FeedbackWidgetProps, FeedbackData };

const THUMBS_UP = 'thumbs_up';
const THUMBS_DOWN = 'thumbs_down';

function ThumbsUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M7 10v12" />
      <path d="M15 5.88 14 10h5.83a2 2 0 0 1 1.92 2.56l-2.33 8A2 2 0 0 1 17.5 22H4a2 2 0 0 1-2-2v-8a2 2 0 0 1 2-2h2.76a2 2 0 0 0 1.79-1.11L12 2a3.13 3.13 0 0 1 3 3.88Z" />
    </svg>
  );
}

function ThumbsDownIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 14V2" />
      <path d="M9 18.12 10 14H4.17a2 2 0 0 1-1.92-2.56l2.33-8A2 2 0 0 1 6.5 2H20a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2h-2.76a2 2 0 0 0-1.79 1.11L12 22a3.13 3.13 0 0 1-3-3.88Z" />
    </svg>
  );
}

function StarIcon({ filled }: { filled: boolean }) {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill={filled ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
    </svg>
  );
}

const lightTheme = {
  '--cyguin-bg': '#ffffff',
  '--cyguin-bg-subtle': '#f1f3f6',
  '--cyguin-border': '#e5e5e5',
  '--cyguin-border-focus': '#ffd21f',
  '--cyguin-fg': '#0a0d17',
  '--cyguin-fg-muted': '#858b98',
  '--cyguin-accent': '#ffd21f',
  '--cyguin-accent-dark': '#e0a900',
  '--cyguin-accent-fg': '#0a0d17',
  '--cyguin-radius': '6px',
  '--cyguin-shadow': '0 1px 4px rgba(0,0,0,0.08)',
};

const darkTheme = {
  '--cyguin-bg': '#0a0d17',
  '--cyguin-bg-subtle': '#101521',
  '--cyguin-border': '#252b3a',
  '--cyguin-border-focus': '#ffd21f',
  '--cyguin-fg': '#f1f3f6',
  '--cyguin-fg-muted': '#858b98',
  '--cyguin-accent': '#ffd21f',
  '--cyguin-accent-dark': '#e0a900',
  '--cyguin-accent-fg': '#0a0d17',
  '--cyguin-radius': '6px',
  '--cyguin-shadow': '0 1px 4px rgba(0,0,0,0.32)',
};

export function FeedbackWidget({
  type,
  url: urlProp,
  userId,
  theme = 'dark',
  className = '',
  onSubmit,
  maxStars = 5,
  placeholder = 'Share your feedback...',
}: FeedbackWidgetProps) {
  const [submitted, setSubmitted] = useState(false);
  const [textValue, setTextValue] = useState('');
  const [loading, setLoading] = useState(false);

  const getUrl = () => {
    if (urlProp) return urlProp;
    if (typeof window !== 'undefined') return window.location.href;
    return '';
  };

  const handleSubmit = useCallback(
    async (body: string) => {
      setLoading(true);
      try {
        const res = await fetch('/api/feedback', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type, body, url: getUrl(), userId }),
        });
        const json = await res.json();
        if (res.ok && json.data) {
          setSubmitted(true);
          onSubmit?.(json.data);
          setTimeout(() => setSubmitted(false), 3000);
        }
      } finally {
        setLoading(false);
      }
    },
    [type, userId, onSubmit],
  );

  if (submitted) {
    return (
      <div
        data-theme={theme}
        className={className}
        style={{ ...(theme === 'dark' ? darkTheme : lightTheme), padding: '12px', borderRadius: 'var(--cyguin-radius)', background: 'var(--cyguin-bg)', border: '1px solid var(--cyguin-border)', boxShadow: 'var(--cyguin-shadow)', fontFamily: 'system-ui, sans-serif', color: 'var(--cyguin-fg)', textAlign: 'center' }}
      >
        Thanks for your feedback!
      </div>
    );
  }

  if (type === 'thumbs') {
    return (
      <div
        data-theme={theme}
        className={className}
        style={{ ...(theme === 'dark' ? darkTheme : lightTheme), display: 'flex', gap: '8px', padding: '12px', borderRadius: 'var(--cyguin-radius)', background: 'var(--cyguin-bg)', border: '1px solid var(--cyguin-border)', boxShadow: 'var(--cyguin-shadow)', fontFamily: 'system-ui, sans-serif' }}
      >
        <button
          onClick={() => handleSubmit(THUMBS_UP)}
          disabled={loading}
          aria-label="Thumbs up"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cyguin-fg)', padding: '4px', borderRadius: 'var(--cyguin-radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ThumbsUpIcon />
        </button>
        <button
          onClick={() => handleSubmit(THUMBS_DOWN)}
          disabled={loading}
          aria-label="Thumbs down"
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--cyguin-fg)', padding: '4px', borderRadius: 'var(--cyguin-radius)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
        >
          <ThumbsDownIcon />
        </button>
      </div>
    );
  }

  if (type === 'rating') {
    const [selected, setSelected] = useState<number | null>(null);

    const handleStarClick = (star: number) => {
      setSelected(star);
      handleSubmit(String(star));
    };

    return (
      <div
        data-theme={theme}
        className={className}
        style={{ ...(theme === 'dark' ? darkTheme : lightTheme), display: 'flex', gap: '4px', padding: '12px', borderRadius: 'var(--cyguin-radius)', background: 'var(--cyguin-bg)', border: '1px solid var(--cyguin-border)', boxShadow: 'var(--cyguin-shadow)', fontFamily: 'system-ui, sans-serif' }}
      >
        {Array.from({ length: maxStars }, (_, i) => {
          const star = i + 1;
          const filled = selected !== null && star <= selected;
          return (
            <button
              key={star}
              onClick={() => handleStarClick(star)}
              disabled={loading}
              aria-label={`${star} star${star > 1 ? 's' : ''}`}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: filled ? 'var(--cyguin-accent)' : 'var(--cyguin-fg-muted)', padding: '2px', borderRadius: 'var(--cyguin-radius)', display: 'flex', alignItems: 'center', transition: 'color 0.15s' }}
            >
              <StarIcon filled={filled} />
            </button>
          );
        })}
      </div>
    );
  }

  if (type === 'text') {
    const handleTextSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (textValue.trim()) {
        handleSubmit(textValue.trim());
        setTextValue('');
      }
    };

    return (
      <div
        data-theme={theme}
        className={className}
        style={{ ...(theme === 'dark' ? darkTheme : lightTheme), padding: '12px', borderRadius: 'var(--cyguin-radius)', background: 'var(--cyguin-bg)', border: '1px solid var(--cyguin-border)', boxShadow: 'var(--cyguin-shadow)', fontFamily: 'system-ui, sans-serif' }}
      >
        <form onSubmit={handleTextSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          <textarea
            value={textValue}
            onChange={(e) => setTextValue(e.target.value)}
            placeholder={placeholder}
            rows={3}
            style={{ width: '100%', padding: '8px', borderRadius: 'var(--cyguin-radius)', border: '1px solid var(--cyguin-border)', background: 'var(--cyguin-bg-subtle)', color: 'var(--cyguin-fg)', fontSize: '14px', resize: 'vertical', outline: 'none', boxSizing: 'border-box', fontFamily: 'inherit' }}
          />
          <button
            type="submit"
            disabled={loading || !textValue.trim()}
            style={{ alignSelf: 'flex-end', padding: '6px 16px', borderRadius: 'var(--cyguin-radius)', border: 'none', background: 'var(--cyguin-accent)', color: 'var(--cyguin-accent-fg)', fontWeight: 600, fontSize: '14px', cursor: 'pointer', opacity: loading || !textValue.trim() ? 0.5 : 1 }}
          >
            {loading ? 'Sending...' : 'Submit'}
          </button>
        </form>
      </div>
    );
  }

  return null;
}
