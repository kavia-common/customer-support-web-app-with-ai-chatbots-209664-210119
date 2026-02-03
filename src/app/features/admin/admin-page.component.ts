import { Component, computed, inject } from '@angular/core';
import { SessionStore } from '../../core/session.store';

@Component({
  standalone: true,
  template: `
    <div class="card" style="padding: 16px;">
      <h2 style="margin-top: 0;">Admin</h2>
      <p class="muted">This route is protected by RBAC (admin only).</p>
      <div class="badge ok">Current role: {{ role() }}</div>

      <div style="height: 14px;"></div>
      <div class="muted" style="font-size: 13px; line-height: 1.4;">
        Add admin features here (user management, ticket rules, knowledge base, etc.).
      </div>
    </div>
  `
})
export class AdminPageComponent {
  private session = inject(SessionStore);
  readonly role = computed(() => this.session.role() ?? '—');
}
