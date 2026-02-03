import { Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import type { ChatMessage } from './models';

type WsState = 'disconnected' | 'connecting' | 'connected';

@Injectable({ providedIn: 'root' })
export class ChatWsService {
  private ws: WebSocket | null = null;
  private reconnectTimer: number | null = null;

  readonly state = signal<WsState>('disconnected');
  readonly messages = signal<ChatMessage[]>([]);

  // PUBLIC_INTERFACE
  /** Connect to chat websocket (optionally bound to a ticket). */
  connect(params: { token: string; ticketId?: string }) {
    this.disconnect();

    const url = new URL(environment.wsBaseUrl.replace(/^http/, 'ws') + '/ws/chat');
    url.searchParams.set('token', params.token);
    if (params.ticketId) url.searchParams.set('ticketId', params.ticketId);

    this.state.set('connecting');
    this.ws = new WebSocket(url.toString());

    this.ws.onopen = () => this.state.set('connected');

    this.ws.onmessage = (ev) => {
      try {
        const msg = JSON.parse(ev.data) as ChatMessage;
        this.messages.update((m) => [...m, msg]);
      } catch {
        // Ignore malformed messages
      }
    };

    this.ws.onerror = () => {
      // Let onclose handle reconnect
    };

    this.ws.onclose = () => {
      this.state.set('disconnected');
      this.ws = null;
      // Lightweight reconnect strategy
      this.scheduleReconnect(params);
    };
  }

  // PUBLIC_INTERFACE
  /** Send a message to the websocket server. */
  send(text: string, ticketId?: string) {
    if (!this.ws || this.state() !== 'connected') return;
    const payload = { text, ticketId };
    this.ws.send(JSON.stringify(payload));
  }

  // PUBLIC_INTERFACE
  /** Disconnect and stop reconnect attempts. */
  disconnect() {
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
    this.state.set('disconnected');
  }

  private scheduleReconnect(params: { token: string; ticketId?: string }) {
    if (this.reconnectTimer) return;
    this.reconnectTimer = window.setTimeout(() => {
      this.reconnectTimer = null;
      // Only attempt if token still present
      if (params.token) this.connect(params);
    }, 1200);
  }
}
