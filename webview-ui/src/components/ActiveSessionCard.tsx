import React from 'react';
import { Project } from '../types';

interface Props {
  project: Project;
}

export default function ActiveSessionCard({ project }: Props) {
  return (
    <div className="rounded-lg border border-green-500/40 bg-green-500/5 p-4">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
        <span className="font-semibold">{project.name}</span>
      </div>
    </div>
  );
}
