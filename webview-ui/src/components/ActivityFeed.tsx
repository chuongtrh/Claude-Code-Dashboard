import React from 'react';

interface ActivityItem {
  id: string;
  type: string;
  description: string;
  timestamp: number;
}

interface Props {
  items: ActivityItem[];
}

export default function ActivityFeed({ items }: Props) {
  return (
    <div className="space-y-2">
      {items.map(item => (
        <div key={item.id} className="flex gap-3 text-sm p-2 rounded hover:bg-[var(--vscode-list-hoverBackground)]">
          <span className="text-xs opacity-50 shrink-0">{new Date(item.timestamp).toLocaleTimeString()}</span>
          <span className="opacity-80">{item.description}</span>
        </div>
      ))}
    </div>
  );
}
