import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SessionStore } from '../../core/session.store';

@Component({
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="card" style="padding: 16px;">
      <div class="row" style="justify-content: space-between; align-items: start;">
        <div>
          <h2 style="margin: 0 0 4px 0;">Welcome</h2>
          <div class="muted">Signed in as {{ email() }}</div>
        </div>
        <span class="badge ok">Role: {{ role() }}</span>
      </div>
    </div>

    <div style="height: 14px;"></div>

    <div class="grid-2">
      <div class="card" style="padding: 16px;">
        <h3 style="margin-top: 0;">Tickets</h3>
        <p class="muted">Create and track support requests.</p>
        <a class="btn primary" routerLink="/app/tickets">Go to tickets</a>
      </div>

      <div class="card" style="padding: 16px;">
        <h3 style="margin-top: 0;">Real-time chat</h3>
        <p class="muted">Chat with an agent or AI assistant.</p>
        <a class="btn primary" routerLink="/app/chat">Open chat</a>
      </div>
    </div>
  `
})
export class DashboardPageComponent {
  private session = inject(SessionStore);
  readonly email = computed(() => this.session.user()?.email ?? '—');
  readonly role = computed(() => this.session.role() ?? '—');
}
