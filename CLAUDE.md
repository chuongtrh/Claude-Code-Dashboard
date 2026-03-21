# Claude Code Dashboard

VS Code extension webview UI. Source: `webview-ui/src/`.

---

## UI/UX Design Guidelines

### Stack
- React + TypeScript + Tailwind CSS — no custom CSS classes
- Recharts only for charts — no other chart libs
- **No external UI lib** (no shadcn, MUI, Radix)
- **No icon lib** — inline SVG only (12×12 or 14×14, `fill="currentColor"`)

### Theming — VS Code variables first
All colors use `var(--vscode-*)` so the UI respects any user theme.

Key variables: `--vscode-editor-background`, `--vscode-editor-foreground`, `--vscode-panel-border`, `--vscode-button-background`, `--vscode-button-foreground`, `--vscode-list-hoverBackground`, `--vscode-list-activeSelectionBackground/Foreground`, `--vscode-badge-background/foreground`.

Tailwind colors are **only** for semantic status:
- Success/active → `green-400`, `green-500/20`
- Warning → `yellow-400`, `yellow-500/20`
- Info/subagents → `blue-400`, `blue-500/20`
- Error → `red-400`, `red-500/20`

### Typography scale
| Role | Classes |
|---|---|
| Page title | `text-2xl font-bold` |
| Section header | `text-sm font-semibold uppercase tracking-wider opacity-60` |
| Body / list | `text-sm` |
| Secondary labels | `text-xs opacity-60` |
| Tertiary / disabled | `text-xs opacity-40` |
| Code / paths | `text-xs font-mono` |
| Metric values | `text-xl font-bold` |

Always add `truncate` on potentially long strings.

### Button patterns (quick reference)
- **Outline action**: `text-xs px-3 py-1.5 rounded border border-[var(--vscode-button-background)] text-[var(--vscode-button-background)] hover:bg-[var(--vscode-button-background)] hover:text-[var(--vscode-button-foreground)] transition-colors`
- **Tab active/inactive**: border-b-2, active gets `border-[var(--vscode-button-background)]`, inactive `border-transparent opacity-60`
- **Toggle pair**: `flex rounded overflow-hidden border border-[var(--vscode-panel-border)]`; active = button-background fill
- **List item**: `hover:bg-[var(--vscode-list-hoverBackground)]`; selected = `bg-[var(--vscode-list-activeSelectionBackground)]`
- **Icon-only**: `opacity-40 hover:opacity-100 transition-opacity`
- **ID chip**: `inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono` — shows first 8 chars, copies full value on click

### Key reusable patterns
- **StatCard**: `rounded-lg border border-[var(--vscode-panel-border)] bg-[var(--vscode-editor-background)] p-4` with `text-xs opacity-50` label and `text-xl font-bold` value
- **Badge**: `text-xs bg-[var(--vscode-badge-background)] text-[var(--vscode-badge-foreground)] px-2 py-0.5 rounded`
- **Live dot**: `<span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />`

### Do not
- No external UI libs (shadcn, MUI, Radix, etc.)
- No hardcoded colors — only VS Code variables or approved semantic Tailwind colors
- No `rounded-xl` or larger; no `shadow-*`
- No icon libraries (lucide, heroicons, etc.)
- No Unicode copy symbols (`⎘`, `📋`) — use inline SVG

For the full design reference (all SVGs, chart color palettes, layout patterns, spacing rules), run `/ui-patterns`.
