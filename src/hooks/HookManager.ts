import * as fs from 'fs';
import * as path from 'path';

const HOOK_COMMAND = `node -e "process.stdin.resume();let d='';process.stdin.on('data',c=>d+=c);process.stdin.on('end',()=>{try{const e=JSON.parse(d);const line=JSON.stringify({type:e.hook_event_name,tool:e.tool_name,projectId:e.session_id,timestamp:Date.now()})+'\\n';require('fs').appendFileSync(require('path').join(require('os').homedir(),'.claude','.dashboard-events.jsonl'),line)}catch(err){}})"`;

export class HookManager {
  private claudeDir: string;

  constructor(claudeDir: string) {
    this.claudeDir = claudeDir;
  }

  async injectHooks(): Promise<void> {
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

    // PostToolUse hook
    const postToolUse = (hooks.PostToolUse as unknown[]) || [];
    const alreadyHasPost = JSON.stringify(postToolUse).includes('.dashboard-events.jsonl');
    if (!alreadyHasPost) {
      postToolUse.push({ matcher: '*', hooks: [dashboardHook] });
      hooks.PostToolUse = postToolUse;
    }

    // Stop hook
    const stopHooks = (hooks.Stop as unknown[]) || [];
    const alreadyHasStop = JSON.stringify(stopHooks).includes('.dashboard-events.jsonl');
    if (!alreadyHasStop) {
      stopHooks.push({ hooks: [dashboardHook] });
      hooks.Stop = stopHooks;
    }

    settings.hooks = hooks;
    fs.writeFileSync(settingsPath, JSON.stringify(settings, null, 2));
  }
}
