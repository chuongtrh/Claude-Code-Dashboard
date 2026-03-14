import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

interface DataPoint {
  label: string;
  tokens: number;
  cost: number;
}

interface Props {
  data: DataPoint[];
}

export default function UsageChart({ data }: Props) {
  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 4, right: 4, left: 0, bottom: 4 }}>
        <XAxis dataKey="label" tick={{ fontSize: 11, opacity: 0.6 }} axisLine={false} tickLine={false} />
        <YAxis tick={{ fontSize: 11, opacity: 0.6 }} axisLine={false} tickLine={false} />
        <Tooltip
          contentStyle={{
            background: 'var(--vscode-editor-background)',
            border: '1px solid var(--vscode-panel-border)',
            borderRadius: 6,
            fontSize: 12,
          }}
        />
        <Bar dataKey="tokens" fill="var(--vscode-button-background)" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
