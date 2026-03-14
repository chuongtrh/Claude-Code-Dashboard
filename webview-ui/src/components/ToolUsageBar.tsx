import React from 'react';
import { ToolUsageStat } from '../types';

interface Props {
  data: ToolUsageStat[];
}

export default function ToolUsageBar({ data }: Props) {
  if (!data || data.length === 0) {
    return <div className="text-sm opacity-40 text-center py-8">No tool usage data yet.</div>;
  }

  const maxCount = data[0].count;

  return (
    <div className="space-y-2">
      {data.map((item) => (
        <div key={item.tool} className="flex items-center gap-3">
          <div className="w-24 text-xs font-mono text-right opacity-70 shrink-0 truncate" title={item.tool}>
            {item.tool}
          </div>
          <div className="flex-1 h-5 bg-[var(--vscode-input-background)] rounded overflow-hidden">
            <div
              className="h-full rounded transition-all"
              style={{
                width: `${maxCount > 0 ? (item.count / maxCount) * 100 : 0}%`,
                background: 'var(--vscode-button-background)',
                opacity: 0.85,
              }}
            />
          </div>
          <div className="text-xs opacity-60 shrink-0 w-24 text-right">
            {item.count} ({item.percentage}%)
          </div>
        </div>
      ))}
    </div>
  );
}
