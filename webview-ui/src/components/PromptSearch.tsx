import React, { useState, useMemo } from 'react';
import { PromptSearchResult } from '../types';

interface Props {
  allPrompts: PromptSearchResult[];
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const lower = text.toLowerCase();
  const idx = lower.indexOf(query.toLowerCase());
  if (idx === -1) return text;
  return (
    <>
      {text.slice(0, idx)}
      <mark style={{ background: 'rgba(99,102,241,0.35)', borderRadius: 2, padding: '0 1px' }}>
        {text.slice(idx, idx + query.length)}
      </mark>
      {text.slice(idx + query.length)}
    </>
  );
}

export default function PromptSearch({ allPrompts }: Props) {
  const [query, setQuery] = useState('');

  const results = useMemo<PromptSearchResult[]>(() => {
    if (!query.trim()) return [];
    const q = query.trim().toLowerCase();
    return allPrompts.filter(p =>
      p.turn.content.toLowerCase().includes(q) ||
      p.projectName.toLowerCase().includes(q)
    ).slice(0, 50);
  }, [query, allPrompts]);

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={query}
        onChange={e => setQuery(e.target.value)}
        placeholder="Search across all prompts..."
        className="w-full rounded px-3 py-2 text-sm bg-[var(--vscode-input-background)] text-[var(--vscode-input-foreground)] border border-[var(--vscode-input-border)] focus:outline-none focus:border-[var(--vscode-focusBorder)]"
        style={{ color: 'var(--vscode-input-foreground)' }}
      />

      {!query.trim() && (
        <div className="text-sm opacity-40 text-center py-8">
          Type to search across all prompts
        </div>
      )}

      {query.trim() && results.length === 0 && (
        <div className="text-sm opacity-40 text-center py-8">
          No prompts found matching "{query}"
        </div>
      )}

      {results.length > 0 && (
        <div className="space-y-2">
          <div className="text-xs opacity-50">{results.length} result{results.length !== 1 ? 's' : ''}</div>
          {results.map((r, i) => (
            <div
              key={`${r.sessionId}-${r.turn.id}-${i}`}
              className="rounded-lg border border-[var(--vscode-panel-border)] p-3 text-sm"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-xs opacity-80">{r.projectName}</span>
                <span className="text-xs opacity-40">·</span>
                <span className="text-xs opacity-40">
                  {new Date(r.turn.timestamp).toLocaleDateString()}
                </span>
              </div>
              <p className="text-xs opacity-70 leading-relaxed whitespace-pre-wrap">
                {highlight(r.snippet, query.trim())}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
