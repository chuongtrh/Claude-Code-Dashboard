import React from 'react';
import { Session } from '../types';

interface Props {
  session: Session;
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}k`;
  return String(n);
}

function formatDuration(ms: number | null): string {
  if (!ms) return '—';
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const h = Math.floor(m / 60);
  if (h > 0) return `${h}h ${m % 60}m`;
  if (m > 0) return `${m}m ${s % 60}s`;
  return `${s}s`;
}

export default function SessionDetail({ session }: Props) {
  return (
    <div className="space-y-4">
      <div className="flex gap-3 text-xs opacity-60 flex-wrap">
        <span>{new Date(session.startTime).toLocaleString()}</span>
        <span>·</span>
        <span>{formatDuration(session.durationMs)}</span>
        <span>·</span>
        <span>{formatTokens(session.totalTokens)} tokens</span>
        <span>·</span>
        <span>${session.costUsd.toFixed(4)}</span>
      </div>

      {session.filesModified.length > 0 && (
        <div>
          <div className="text-xs opacity-50 mb-1">Files modified</div>
          <div className="flex flex-wrap gap-1">
            {session.filesModified.map(f => (
              <span
                key={f}
                className="text-xs bg-[var(--vscode-badge-background)] px-2 py-0.5 rounded font-mono truncate max-w-[200px]"
                title={f}
              >
                {f.split('/').pop()}
              </span>
            ))}
          </div>
        </div>
      )}

      <div className="text-xs opacity-50">
        {session.promptCount} prompts · {session.toolCallCount} tool calls
      </div>
    </div>
  );
}
