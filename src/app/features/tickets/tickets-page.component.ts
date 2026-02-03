import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import type { Ticket } from '../../core/models';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="row" style="justify-content: space-between; align-items: flex-end;">
      <div>
        <h2 style="margin: 0;">Tickets</h2>
        <div class="muted">Create, track, and manage support tickets.</div>
      </div>
      <button class="btn" type="button" (click)="refresh()" [disabled]="loading()">Refresh</button>
    </div>

    <div style="height: 14px;"></div>

    <div class="grid-2">
      <div class="card" style="padding: 16px;">
        <h3 style="margin-top: 0;">Create ticket</h3>

        <div style="display: grid; gap: 10px;">
          <div>
            <div class="label">Title</div>
            <input class="input" [(ngModel)]="title" />
          </div>
          <div>
            <div class="label">Description</div>
            <textarea class="input" rows="5" [(ngModel)]="description"></textarea>
          </div>

          @if (createError()) {
            <div class="badge danger">{{ createError() }}</div>
          }

          <div class="row" style="justify-content: flex-end;">
            <button class="btn primary" type="button" (click)="create()" [disabled]="creating()">
              {{ creating() ? 'Creating...' : 'Create' }}
            </button>
          </div>
        </div>
      </div>

      <div class="card" style="padding: 16px;">
        <h3 style="margin-top: 0;">Your tickets</h3>

        @if (error()) {
          <div class="badge danger">{{ error() }}</div>
        } @else if (loading()) {
          <div class="muted">Loading...</div>
        } @else if (tickets().length === 0) {
          <div class="muted">No tickets yet.</div>
        } @else {
          <div style="display: grid; gap: 10px;">
            @for (t of tickets(); track t.id) {
              <a class="card" style="padding: 12px; display: block;" [routerLink]="['/app/tickets', t.id]">
                <div class="row" style="justify-content: space-between;">
                  <strong>{{ t.title }}</strong>
                  <span class="badge">{{ t.status }} • {{ t.priority }}</span>
                </div>
                <div class="muted" style="margin-top: 6px; font-size: 13px; line-height: 1.35;">
                  {{ t.description }}
                </div>
              </a>
            }
          </div>
        }
      </div>
    </div>
  `
})
export class TicketsPageComponent {
  private api = inject(ApiService);

  tickets = signal<Ticket[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  title = '';
  description = '';
  creating = signal(false);
  createError = signal<string | null>(null);

  ngOnInit() {
    this.refresh();
  }

  refresh() {
    this.error.set(null);
    this.loading.set(true);
    this.api.listTickets().subscribe({
      next: (t) => {
        this.tickets.set(t);
        this.loading.set(false);
      },
      error: (err) => {
        const msg = err?.error?.detail ?? 'Failed to load tickets';
        this.error.set(String(msg));
        this.loading.set(false);
      }
    });
  }

  create() {
    this.createError.set(null);
    if (!this.title.trim() || !this.description.trim()) {
      this.createError.set('Title and description are required.');
      return;
    }

    this.creating.set(true);
    this.api.createTicket({ title: this.title.trim(), description: this.description.trim() }).subscribe({
      next: (t) => {
        this.title = '';
        this.description = '';
        this.tickets.update((cur) => [t, ...cur]);
        this.creating.set(false);
      },
      error: (err) => {
        const msg = err?.error?.detail ?? 'Failed to create ticket';
        this.createError.set(String(msg));
        this.creating.set(false);
      }
    });
  }
}
