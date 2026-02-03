import { Component, computed, effect, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { SessionStore } from '../../core/session.store';
import { ChatWsService } from '../../core/chat-ws.service';

@Component({
  standalone: true,
  imports: [FormsModule],
  styles: [
    `
      .chatWrap {
        display: grid;
        grid-template-rows: auto 1fr auto;
        height: calc(100vh - 140px);
        min-height: 420px;
      }
      .msgs {
        overflow: auto;
        padding: 12px;
        display: grid;
        gap: 10px;
      }
      .bubble {
        max-width: 78%;
        padding: 10px 12px;
        border-radius: 14px;
        border: var(--border);
        background: rgba(255, 255, 255, 0.05);
        line-height: 1.35;
        white-space: pre-wrap;
      }
      .mine {
        justify-self: end;
        background: rgba(96, 165, 250, 0.12);
        border-color: rgba(96, 165, 250, 0.35);
      }
      .meta {
        font-size: 11px;
        color: var(--muted);
        margin-top: 6px;
      }
      .composer {
        border-top: var(--border);
        padding: 12px;
        display: grid;
        grid-template-columns: 1fr auto;
        gap: 10px;
      }
      .topbar {
        padding: 12px 16px;
        border-bottom: var(--border);
        display: flex;
        justify-content: space-between;
        align-items: center;
        gap: 10px;
      }
    `
  ],
  template: `
    <div class="card chatWrap">
      <div class="topbar">
        <div>
          <strong>Real-time chat</strong>
          <div class="muted" style="font-size: 12px;">
            Status: {{ wsState() }} @if (ticketId()) { • Ticket: {{ ticketId() }} }
          </div>
        </div>
        <button class="btn" type="button" (click)="reconnect()">Reconnect</button>
      </div>

      <div class="msgs" #scrollHost>
        @if (messages().length === 0) {
          <div class="muted">No messages yet. Say hello!</div>
        } @else {
          @for (m of messages(); track m.id) {
            <div class="bubble" [class.mine]="isMine(m.author)">
              <div><strong style="text-transform: capitalize;">{{ m.author }}</strong></div>
              <div style="margin-top: 6px;">{{ m.text }}</div>
              <div class="meta">{{ m.createdAt }}</div>
            </div>
          }
        }
      </div>

      <div class="composer">
        <input class="input" [(ngModel)]="draft" (keydown.enter)="send()" placeholder="Type a message..." />
        <button class="btn primary" type="button" (click)="send()" [disabled]="!draft.trim()">Send</button>
      </div>
    </div>
  `
})
export class ChatPageComponent {
  private session = inject(SessionStore);
  private route = inject(ActivatedRoute);
  private chat = inject(ChatWsService);

  draft = '';
  ticketId = signal<string | null>(null);

  readonly wsState = computed(() => this.chat.state());
  readonly messages = computed(() => this.chat.messages());
  readonly token = computed(() => this.session.accessToken() ?? '');

  constructor() {
    // Bind optional ticketId from query param
    const qp = this.route.snapshot.queryParamMap.get('ticketId');
    if (qp) this.ticketId.set(qp);

    effect(() => {
      const token = this.token();
      if (!token) return;
      this.chat.connect({ token, ticketId: this.ticketId() ?? undefined });
    });
  }

  isMine(author: string) {
    // Treat "user" as the signed-in customer/agent for this minimal demo.
    return author === 'user' || author === 'agent';
  }

  send() {
    const text = this.draft.trim();
    if (!text) return;
    this.chat.send(text, this.ticketId() ?? undefined);
    this.draft = '';
  }

  reconnect() {
    const token = this.session.accessToken();
    if (!token) return;
    this.chat.connect({ token, ticketId: this.ticketId() ?? undefined });
  }
}
