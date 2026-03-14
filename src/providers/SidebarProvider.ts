import * as vscode from 'vscode';
import { DashboardStore, Project } from '../store/DashboardStore';

export class SidebarProvider implements vscode.TreeDataProvider<SidebarItem> {
  private _onDidChangeTreeData = new vscode.EventEmitter<SidebarItem | undefined>();
  readonly onDidChangeTreeData = this._onDidChangeTreeData.event;

  constructor(private store: DashboardStore, private context: vscode.ExtensionContext) {
    store.on('updated', () => this._onDidChangeTreeData.fire(undefined));
  }

  getTreeItem(element: SidebarItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: SidebarItem): SidebarItem[] {
    if (element) { return []; }

    const items: SidebarItem[] = [];
    const projects = this.store.getProjects();
    const stats = this.store.getStats();

    // Header: Open Dashboard button
    items.push(new SidebarItem(
      `Open Full Dashboard`,
      vscode.TreeItemCollapsibleState.None,
      '$(dashboard)',
      { command: 'claudeDashboard.openDashboard', title: 'Open Dashboard', arguments: [] }
    ));

    // Stats summary
    items.push(new SidebarItem(
      `${stats.activeSessionCount} active · ${formatTokens(stats.tokensTodayTotal)} today`,
      vscode.TreeItemCollapsibleState.None,
      '$(pulse)',
      undefined,
      'stats'
    ));

    // Separator label
    const active = projects.filter(p => p.isActive);
    const recent = projects.filter(p => !p.isActive && Date.now() - p.lastActive < 7 * 86_400_000);
    const rest = projects.filter(p => !p.isActive && Date.now() - p.lastActive >= 7 * 86_400_000);

    if (active.length > 0) {
      items.push(new SidebarItem('ACTIVE NOW', vscode.TreeItemCollapsibleState.None, undefined, undefined, 'section'));
      for (const p of active) { items.push(projectItem(p)); }
    }

    if (recent.length > 0) {
      items.push(new SidebarItem('RECENT', vscode.TreeItemCollapsibleState.None, undefined, undefined, 'section'));
      for (const p of recent) { items.push(projectItem(p)); }
    }

    if (rest.length > 0) {
      items.push(new SidebarItem(`ALL PROJECTS (${rest.length})`, vscode.TreeItemCollapsibleState.None, undefined, undefined, 'section'));
      for (const p of rest) { items.push(projectItem(p)); }
    }

    return items;
  }
}

function projectItem(p: Project): SidebarItem {
  const label = p.isActive ? `● ${p.name}` : `○ ${p.name}`;
  const desc = p.isActive ? 'live' : timeAgo(p.lastActive);
  const item = new SidebarItem(
    label,
    vscode.TreeItemCollapsibleState.None,
    p.isActive ? '$(circle-filled)' : '$(circle-outline)',
    { command: 'claudeDashboard.openProject', title: 'Open Project', arguments: [p.id] },
    'project'
  );
  item.description = desc;
  item.tooltip = p.path;
  return item;
}

class SidebarItem extends vscode.TreeItem {
  constructor(
    label: string,
    collapsibleState: vscode.TreeItemCollapsibleState,
    iconId?: string,
    command?: vscode.Command,
    contextValue?: string
  ) {
    super(label, collapsibleState);
    if (iconId) { this.iconPath = new vscode.ThemeIcon(iconId.replace('$(', '').replace(')', '')); }
    if (command) { this.command = command; }
    this.contextValue = contextValue;
  }
}

function formatTokens(n: number): string {
  if (n >= 1_000_000) { return `${(n / 1_000_000).toFixed(1)}M tokens`; }
  if (n >= 1_000) { return `${(n / 1_000).toFixed(1)}k tokens`; }
  return `${n} tokens`;
}

function timeAgo(ts: number): string {
  if (!ts) { return 'never'; }
  const diff = Date.now() - ts;
  const h = Math.floor(diff / 3_600_000);
  const d = Math.floor(diff / 86_400_000);
  if (h < 1) { return 'just now'; }
  if (h < 24) { return `${h}h ago`; }
  return `${d}d ago`;
}
