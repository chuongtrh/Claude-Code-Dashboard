// Bridge to VSCode webview API — falls back gracefully in browser dev mode
interface VSCodeAPI {
  postMessage(message: unknown): void;
  getState(): unknown;
  setState(state: unknown): void;
}

declare function acquireVsCodeApi(): VSCodeAPI;

let api: VSCodeAPI | undefined;
try {
  api = acquireVsCodeApi();
} catch {
  api = undefined;
}

export const vscode = {
  postMessage: (message: unknown) => api?.postMessage(message),
};
