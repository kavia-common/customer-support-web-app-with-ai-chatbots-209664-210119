import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import type { Ticket } from '../../core/models';
import { SessionStore } from '../../core/session.store';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <a class="muted" routerLink="/app/tickets">← Back to tickets</a>

    <div style="height: 10px;"></div>

    @if (loading()) {
      <div class="card" style="padding: 16px;">
        <div class="muted">Loading ticket...</div>
      </div>
    } @else if (error()) {
      <div class="card" style="padding: 16px;">
        <div class="badge danger">{{ error() }}</div>
      </div>
    } @else if (ticket()) {
      <div class="card" style="padding: 16px;">
        <div class="row" style="justify-content: space-between; align-items: start;">
          <div>
            <h2 style="margin: 0 0 6px 0;">{{ ticket()!.title }}</h2>
            <div class="muted">Ticket ID: {{ ticket()!.id }}</div>
          </div>
          <span class="badge">{{ ticket()!.status }} • {{ ticket()!.priority }}</span>
        </div>

        <div style="height: 12px;"></div>

        <div class="muted" style="white-space: pre-wrap; line-height: 1.4;">{{ ticket()!.description }}</div>

        @if (ticket()!.aiSummary) {
          <div style="height: 14px;"></div>
          <div class="card" style="padding: 12px; background: rgba(96, 165, 250, 0.08);">
            <div class="row" style="justify-content: space-between;">
              <strong>AI summary</strong>
              <span class="badge ok">Generated</span>
            </div>
            <div class="muted" style="margin-top: 8px; white-space: pre-wrap;">{{ ticket()!.aiSummary }}</div>
          </div>
        }
      </div>

      <div style="height: 14px;"></div>

      <div class="grid-2">
        <div class="card" style="padding: 16px;">
          <h3 style="margin-top: 0;">Update status</h3>
          <div class="label">Status</div>
          <select class="input" [(ngModel)]="status">
            <option value="open">open</option>
            <option value="pending">pending</option>
            <option value="closed">closed</option>
          </select>

          <div style="height: 10px;"></div>
          <div class="label">Priority</div>
          <select class="input" [(ngModel)]="priority">
            <option value="low">low</option>
            <option value="medium">medium</option>
            <option value="high">high</option>
          </select>

          @if (updateError()) {
            <div style="height: 10px;"></div>
            <div class="badge danger">{{ updateError() }}</div>
          }

          <div style="height: 10px;"></div>
          <div class="row" style="justify-content: flex-end;">
            <button class="btn primary" type="button" (click)="save()" [disabled]="saving()">
              {{ saving() ? 'Saving...' : 'Save' }}
            </button>
          </div>

          <div style="height: 8px;"></div>
          <div class="muted" style="font-size: 12px;">
            Note: agents/admins typically update status/priority; backend enforces RBAC.
          </div>
        </div>

        <div class="card" style="padding: 16px;">
          <h3 style="margin-top: 0;">Chat</h3>
          <p class="muted">Open the chat page to discuss this ticket in real time.</p>
          <a class="btn" [routerLink]="['/app/chat']" [queryParams]="{ ticketId: ticket()!.id }">Open chat for ticket</a>

          <div style="height: 10px;"></div>
          <div class="badge">You are: {{ role() }}</div>
        </div>
      </div>
    }
  `
})
export class TicketDetailPageComponent {
  private route = inject(ActivatedRoute);
  private api = inject(ApiService);
  private session = inject(SessionStore);

  ticket = signal<Ticket | null>(null);
  loading = signal(true);
  error = signal<string | null>(null);

  saving = signal(false);
  updateError = signal<string | null>(null);

  status: Ticket['status'] = 'open';
  priority: Ticket['priority'] = 'medium';

  readonly role = computed(() => this.session.role() ?? '—');

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error.set('Missing ticket id');
      this.loading.set(false);
      return;
    }

    this.api.getTicket(id).subscribe({
      next: (t) => {
        this.ticket.set(t);
        this.status = t.status;
        this.priority = t.priority;
        this.loading.set(false);
      },
      error: (err) => {
        const msg = err?.error?.detail ?? 'Failed to load ticket';
        this.error.set(String(msg));
        this.loading.set(false);
      }
    });
  }

  save() {
    const t = this.ticket();
    if (!t) return;

    this.updateError.set(null);
    this.saving.set(true);

    this.api.updateTicket(t.id, { status: this.status, priority: this.priority }).subscribe({
      next: (updated) => {
        this.ticket.set(updated);
        this.saving.set(false);
      },
      error: (err) => {
        const msg = err?.error?.detail ?? 'Failed to update ticket';
        this.updateError.set(String(msg));
        this.saving.set(false);
      }
    });
  }
}
