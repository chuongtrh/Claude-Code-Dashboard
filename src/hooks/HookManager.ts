import * as fs from 'fs';
import * as path from 'path';

const HOOK_COMMAND = `node -e "process.stdin.resume();let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const e=JSON.parse(d);const line=JSON.stringify({type:e.hook_event_name,tool:e.tool_name,sessionId:e.session_id,timestamp:Date.now()})+'\\n';require('fs').appendFileSync(require('path').join(require('os').homedir(),'.claude','.dashboard-events.jsonl'),line)}catch(err){}})"`;

const HOOK_VERSION = 2;

export class HookManager {
  private claudeDir: string;

  constructor(claudeDir: string) {
    this.claudeDir = claudeDir;
  }

  /** Check if hooks need re-injection (version mismatch or missing) */
  needsReinjection(globalState: { get(key: string): unknown }): boolean {
    const storedVersion = globalState.get('dashboardHookVersion') as number | undefined;
    return storedVersion !== HOOK_VERSION;
  }

  async injectHooks(globalState?: { get(key: string): unknown; update(key: string, value: unknown): Thenable<void> }): Promise<void> {
    const settingsPath = path.join(this.claudeDir, 'settings.json');
    let settings: Record<string, unknown> = {};

    if (fs.existsSync(settingsPath)) {
      try {
        // Backup before modifying
        fs.copyFileSync(settingsPath, settingsPath + '.bak');
        settings = JSON.parse(fs.readFileSync(settingsPath, 'utf-8'));
      } catch { settings = {}; }
    }

    const dashboardHook = { type: 'command', command: HOOK_COMMAND };

    const hooks = (settings.hooks as Record<string, unknown[]>) || {};

    // Remove old dashboard hooks before re-injecting
    const removeOldHooks = (arr: unknown[]): unknown[] =>
      arr.filter(h => !JSON.stringify(h).includes('.dashboard-events.jsonl'));

    // PostToolUse hook
    const postToolUse = removeOldHooks((hooks.PostToolUse as unknown[]) || []);
    postToolUse.push({ matcher: '*', hooks: [dashboardHook] });
    hooks.PostToolUse = postToolUse;

    // Stop hook
    const stopHooks = removeOldHooks((hooks.Stop as unknown[]) || []);
    stopHooks.push({ hooks: [dashboardHook] });
    hooks.Stop = stopHooks;

    settings.hooks = hooks;
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));

    // Store version so we know when to re-inject
    if (globalState) {
      await globalState.update('dashboardHookVersion', HOOK_VERSION);
    }
  }
}
