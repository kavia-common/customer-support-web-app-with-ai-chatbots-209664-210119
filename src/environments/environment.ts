export const environment = {
  production: false,
  /**
   * Base URL for REST API (e.g., http://localhost:8000).
   * This is intentionally a placeholder for template usage.
   */
  apiBaseUrl: (globalThis as any).__API_BASE_URL__ ?? 'http://localhost:8000',
  /**
   * Base URL for WebSocket server (e.g., ws://localhost:8000).
   */
  wsBaseUrl: (globalThis as any).__WS_BASE_URL__ ?? 'ws://localhost:8000'
};
