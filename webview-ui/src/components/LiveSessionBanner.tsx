import React from 'react';

interface Props {
  activeCount: number;
}

export default function LiveSessionBanner({ activeCount }: Props) {
  if (activeCount === 0) return null;

  return (
    <div className="flex items-center gap-2 px-4 py-2 bg-green-500/10 border border-green-500/30 rounded-lg text-sm">
      <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shrink-0" />
      <span className="text-green-400 font-medium">
        {activeCount} active session{activeCount > 1 ? 's' : ''} running
      </span>
    </div>
  );
}
