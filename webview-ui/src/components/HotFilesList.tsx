import React from 'react';
import { HotFile } from '../types';

interface Props {
  data: HotFile[];
}

export default function HotFilesList({ data }: Props) {
  if (!data || data.length === 0) {
    return <div className="text-sm opacity-40 text-center py-8">No file edit data yet.</div>;
  }

  return (
    <div className="space-y-2">
      {data.map((item, idx) => (
        <div
          key={idx}
          className="flex items-start gap-3 rounded p-2 hover:bg-[var(--vscode-list-hoverBackground)] transition-colors"
        >
          <div className="flex-1 min-w-0">
            <div className="font-semibold text-sm truncate" title={item.fullPath}>
              {item.file}
            </div>
            <div className="text-xs opacity-40 truncate font-mono mt-0.5" title={item.fullPath}>
              {item.fullPath}
            </div>
            <div className="flex flex-wrap gap-1 mt-1">
              {item.projects.map((proj) => (
                <span
                  key={proj}
                  className="text-xs bg-[var(--vscode-badge-background)] text-[var(--vscode-badge-foreground)] px-1.5 py-0.5 rounded"
                >
                  {proj}
                </span>
              ))}
            </div>
          </div>
          <div className="shrink-0 text-xs font-semibold bg-[var(--vscode-button-background)] text-[var(--vscode-button-foreground)] px-2 py-0.5 rounded-full">
            {item.editCount}
          </div>
        </div>
      ))}
    </div>
  );
}
