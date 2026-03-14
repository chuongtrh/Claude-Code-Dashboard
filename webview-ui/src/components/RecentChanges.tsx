import React from 'react';
import { RecentFileChange } from '../types';

interface Props {
  data: RecentFileChange[];
}

function timeAgo(ts: number): string {
  if (!ts) { return 'unknown'; }
  const diff = Date.now() - ts;
  const mins = Math.floor(diff / 60_000);
  const hours = Math.floor(diff / 3_600_000);
  const days = Math.floor(diff / 86_400_000);
  if (mins < 1) { return 'just now'; }
  if (mins < 60) { return `${mins}m ago`; }
  if (hours < 24) { return `${hours}h ago`; }
  return `${days}d ago`;
}

export default function RecentChanges({ data }: Props) {
  if (!data || data.length === 0) {
    return <div className="text-sm opacity-40 text-center py-8">No recent file changes.</div>;
  }

  return (
    <div className="space-y-1">
      {data.map((item, idx) => (
        <div
          key={idx}
          className="flex items-center gap-3 rounded p-2 hover:bg-[var(--vscode-list-hoverBackground)] transition-colors"
        >
          <span
            className={`text-xs font-semibold px-1.5 py-0.5 rounded shrink-0 ${
              item.type === 'created'
                ? 'bg-green-500/20 text-green-400'
                : 'bg-blue-500/20 text-blue-400'
            }`}
          >
            {item.type === 'created' ? 'created' : 'modified'}
          </span>
          <span className="font-medium text-sm truncate flex-1 min-w-0" title={item.fullPath}>
            {item.file}
          </span>
          <span className="text-xs opacity-50 shrink-0">{item.project}</span>
          <span className="text-xs opacity-40 shrink-0">{timeAgo(item.timestamp)}</span>
        </div>
      ))}
    </div>
  );
}
