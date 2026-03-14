import * as fs from 'fs';
import * as path from 'path';
import * as vscode from 'vscode';
import { DashboardStore, LiveEvent } from '../store/DashboardStore';

export class EventWatcher {
  private claudeDir: string;
  private store: DashboardStore;
  private lastSize = 0;
  private eventsFile: string;
  private timer?: NodeJS.Timeout;

  constructor(claudeDir: string, store: DashboardStore) {
    this.claudeDir = claudeDir;
    this.store = store;
    this.eventsFile = path.join(claudeDir, '.dashboard-events.jsonl');
  }

  start(context: vscode.ExtensionContext) {
    // Poll the events file every 500ms for new hook events
    this.timer = setInterval(() => this.checkForNewEvents(), 500);
    context.subscriptions.push({ dispose: () => clearInterval(this.timer!) });
  }

  private checkForNewEvents() {
    if (!fs.existsSync(this.eventsFile)) { return; }
    try {
      const stat = fs.statSync(this.eventsFile);
      if (stat.size <= this.lastSize) { return; }

      const fd = fs.openSync(this.eventsFile, 'r');
      const buffer = Buffer.alloc(stat.size - this.lastSize);
      fs.readSync(fd, buffer, 0, buffer.length, this.lastSize);
      fs.closeSync(fd);
      this.lastSize = stat.size;

      const newLines = buffer.toString('utf-8').trim().split('\n').filter(Boolean);
      for (const line of newLines) {
        try {
          const event = JSON.parse(line) as LiveEvent;
          this.store.handleLiveEvent(event);
        } catch { /* skip malformed */ }
      }
    } catch { /* file may be in use */ }
  }
}
