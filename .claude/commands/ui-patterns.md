---
description: Claude Code Dashboard design system reference — use this before writing any UI code to stay visually consistent
---

You are working on the **Claude Code Dashboard** — a VS Code extension webview UI built with React, TypeScript, and Tailwind CSS. Before writing or editing any UI code, internalize the rules below. Deviating from these patterns will produce an inconsistent UI.

---

## Stack

- **React + TypeScript** in `webview-ui/src/`
- **Tailwind CSS** — utility-first, no custom CSS classes
- **Recharts** — only charting library; no other chart libraries
- **No external UI component library** — everything is hand-built with Tailwind
- **No icon library** — use inline SVGs (12×12 or 14×14) or minimal Unicode symbols

---

## Theming — VS Code Variables First

All colors must use VS Code CSS variables so the UI respects any user theme (dark, light, custom).

| Purpose | Variable |
|---|---|
| Base background | `var(--vscode-editor-background)` |
| Default text | `var(--vscode-editor-foreground)` |
| Borders / dividers | `var(--vscode-panel-border)` |
| Primary action fill | `var(--vscode-button-background)` |
| Primary action text | `var(--vscode-button-foreground)` |
| List item hover | `var(--vscode-list-hoverBackground)` |
| List item selected bg | `var(--vscode-list-activeSelectionBackground)` |
| List item selected text | `var(--vscode-list-activeSelectionForeground)` |
| Input background | `var(--vscode-input-background)` |
| Input border | `var(--vscode-input-border)` |
| Badge background | `var(--vscode-badge-background)` |
| Badge text | `var(--vscode-badge-foreground)` |
| Monospace font | `var(--vscode-font-family)` (use `font-mono` class) |

Tailwind accent colors are allowed only for semantic statuses:

| Status | Color |
|---|---|
| Active / success / live | `green-400`, `green-500/20` |
| Warning / thinking | `yellow-400`, `yellow-500/20` |
| Subagents / info | `blue-400`, `blue-500/20` |
| Error / danger | `red-400`, `red-500/20` |

---

## Typography

| Role | Classes |
|---|---|
| Page title | `text-2xl font-bold` |
| Section header | `text-sm font-semibold uppercase tracking-wider opacity-60` |
| Body / list text | `text-sm` |
| Secondary labels | `text-xs opacity-60` |
| Tertiary / disabled | `text-xs opacity-40` |
| Code / file paths | `text-xs font-mono` |
| Large metric values | `text-xl font-bold` |
| Italic hints | `text-xs opacity-50 italic` (session summaries etc.) |

Always use `truncate` on potentially long strings. Never let text overflow without it.

---

## Spacing

- Container padding: `p-6`
- Card internal padding: `p-4` or `p-3`
- Section gaps: `space-y-4` or `space-y-3`
- Flex gaps: `gap-1`, `gap-2`, `gap-3` — use `gap-1.5` for tightly-paired items (label + value)
- Standard bottom margin for section headers: `mb-3`
- Max content width: `max-w-4xl` or `max-w-5xl` centered with `mx-auto`

---

## Borders & Radius

- Cards / containers: `rounded-lg border border-[var(--vscode-panel-border)] bg-[var(--vscode-editor-background)]`
- Standard interactive elements: `rounded`
- Pills / badges: `rounded-full` or `rounded`
- Custom tight radius: `rounded-[3px]`
- Never use `rounded-xl` or larger

---

## Buttons

**Outline action button** (e.g. Export):
```tsx
className="text-xs px-3 py-1.5 rounded border border-[var(--vscode-button-background)] text-[var(--vscode-button-background)] hover:bg-[var(--vscode-button-background)] hover:text-[var(--vscode-button-foreground)] transition-colors"
```

**Tab button** (active / inactive):
```tsx
// wrapper: flex gap-1 border-b border-[var(--vscode-panel-border)]
// active:
className="px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px border-[var(--vscode-button-background)] text-[var(--vscode-button-background)]"
// inactive:
className="px-4 py-2 text-sm font-medium transition-colors border-b-2 -mb-px border-transparent opacity-60 hover:opacity-100"
```

**Toggle pair** (e.g. sort options):
```tsx
// wrapper: flex rounded overflow-hidden border border-[var(--vscode-panel-border)] text-xs
// active:   bg-[var(--vscode-button-background)] text-[var(--vscode-button-foreground)] px-3 py-1
// inactive: opacity-60 hover:opacity-100 px-3 py-1 transition-colors
```

**List item button**:
```tsx
// unselected: hover:bg-[var(--vscode-list-hoverBackground)]
// selected:   bg-[var(--vscode-list-activeSelectionBackground)] text-[var(--vscode-list-activeSelectionForeground)]
```

**Icon-only button** (copy, expand, etc.):
```tsx
className="opacity-40 hover:opacity-100 transition-opacity shrink-0"
```

**Short-hash / ID chip** (clickable, copies full value on click — use for session IDs, hashes, etc.):
```tsx
// Lives inline inside a `flex flex-wrap gap-x-3 text-xs opacity-60` metadata row.
// Shows first 8 chars. Full value in tooltip. Entire chip is the copy button.
<button
  onClick={copyId}
  title={copied ? 'Copied full ID!' : `Copy ID: ${fullId}`}
  className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded font-mono transition-all -my-0.5 ${
    copied
      ? 'bg-green-500/20 !text-green-400 !opacity-100'
      : 'bg-[var(--vscode-editor-inactiveSelectionBackground)] hover:!opacity-90'
  }`}
>
  {copied ? <CheckmarkSVG /> : <HashGridSVG />}
  {copied ? 'copied' : fullId.slice(0, 8)}
</button>
```
- Hash/grid icon (10×10) signals "identifier"; checkmark (10×10) on success
- `!opacity-100` and `!text-green-400` override the parent row's `opacity-60`
- Never show the full ID inline — 8 chars is enough; full ID is in the tooltip

---

## Icons

**No icon library.** Use:

1. **Inline SVG** — preferred for standard actions (copy, check, expand). Always `width="12" height="12"` or `width="14" height="14"`, `fill="currentColor"`.
2. **Unicode symbols** — acceptable for one-off status indicators:
   - `·` bullet separator
   - `—` null / empty value
   - `▶` expand/collapse
   - `⊞` grid/dashboard

**Standard inline SVGs to reuse:**

Copy icon:
```tsx
<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
  <path d="M0 6.75C0 5.784.784 5 1.75 5h1.5a.75.75 0 010 1.5h-1.5a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-1.5a.75.75 0 011.5 0v1.5A1.75 1.75 0 019.25 16h-7.5A1.75 1.75 0 010 14.25v-7.5z"/>
  <path d="M5 1.75C5 .784 5.784 0 6.75 0h7.5C15.216 0 16 .784 16 1.75v7.5A1.75 1.75 0 0114.25 11h-7.5A1.75 1.75 0 015 9.25v-7.5zm1.75-.25a.25.25 0 00-.25.25v7.5c0 .138.112.25.25.25h7.5a.25.25 0 00.25-.25v-7.5a.25.25 0 00-.25-.25h-7.5z"/>
</svg>
```

Checkmark (confirm/success):
```tsx
<svg width="12" height="12" viewBox="0 0 16 16" fill="currentColor">
  <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
</svg>
```

**Animated indicators:**
- Live / active: `<span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />`
- Inline session dot: `<span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse shrink-0" />`

**Emoji status badges** (use sparingly):
- `⚡` extended thinking
- `🆕` newly created file
- `✏️` edited file

---

## Stat Card (reusable pattern)

```tsx
function StatCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-[var(--vscode-panel-border)] bg-[var(--vscode-editor-background)] p-4">
      <div className="text-xs opacity-50 mb-1">{label}</div>
      <div className="text-xl font-bold">{value}</div>
    </div>
  );
}
```

---

## Badge pattern

```tsx
<span className="text-xs bg-[var(--vscode-badge-background)] text-[var(--vscode-badge-foreground)] px-2 py-0.5 rounded">
  {label}
</span>
```

Status badge (colored):
```tsx
// green: bg-green-500/20 text-green-400
// blue:  bg-blue-500/20 text-blue-400
// yellow: bg-yellow-500/20 text-yellow-400
// red:  bg-red-500/10 text-red-400
```

---

## Layout Patterns

- Scrollable list pane: `overflow-y-auto max-h-[70vh]`
- Two-column session layout: `grid gap-4` with `gridTemplateColumns: 'minmax(0,1fr) minmax(0,2fr)'`
- Responsive stats row: `grid grid-cols-3 gap-3` or `grid grid-cols-2 sm:grid-cols-4 gap-3`
- Always use `min-w-0 overflow-hidden` on grid children that contain truncated text

---

## Chart Colors

Tool usage bars use this fixed palette (in `TOOL_COLORS` map):
```
Read #6366f1 · Write #22c55e · Edit #f59e0b · MultiEdit #f97316
Bash #ef4444 · Glob #8b5cf6 · Grep #ec4899 · Agent #06b6d4
WebFetch #14b8a6 · WebSearch #3b82f6 · mcp__* #06b6d4
```

Category / pattern charts:
```
Fix/Bug #ef4444 · Explain #3b82f6 · Refactor #f59e0b
Feature #22c55e · Test #8b5cf6 · Other #6b7280
```

Heatmap: indigo gradient `rgba(99,102,241,0.05)` → `rgba(99,102,241,0.95)`

---

## Do Not

- Do not use any external UI component library (no shadcn, no MUI, no Radix)
- Do not hardcode colors — use VS Code variables or the approved Tailwind semantic colors
- Do not add `rounded-xl` or larger
- Do not add drop shadows (`shadow-*`) — they look out of place in VS Code webviews
- Do not use icon libraries (lucide, heroicons, etc.) — inline SVG only
- Do not use `text-base` or larger for anything other than page titles
- Do not add `font-bold` to body/list text — reserve it for metrics and headings
- Do not use Unicode copy symbols (`⎘`, `📋`) — use the inline SVG defined above
