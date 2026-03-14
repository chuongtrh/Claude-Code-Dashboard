import * as fs from 'fs';
import * as path from 'path';

export interface ClaudeSettings {
  hooks?: Record<string, unknown[]>;
  mcpServers?: Record<string, unknown>;
  [key: string]: unknown;
}

export class SettingsParser {
  readGlobalSettings(claudeDir: string): ClaudeSettings {
    const settingsPath = path.join(claudeDir, 'settings.json');
    if (!fs.existsSync(settingsPath)) { return {}; }
    try {
      return JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    } catch { return {}; }
  }

  readProjectSettings(projectPath: string): ClaudeSettings {
    const settingsPath = path.join(projectPath, '.claude', 'settings.json');
    if (!fs.existsSync(settingsPath)) { return {}; }
    try {
      return JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
    } catch { return {}; }
  }

  readClaudeMd(dirPath: string): string | null {
    const mdPath = path.join(dirPath, 'CLAUDE.md');
    if (!fs.existsSync(mdPath)) { return null; }
    try { return fs.readFileSync(mdPath, 'utf-8'); } catch { return null; }
  }
}
