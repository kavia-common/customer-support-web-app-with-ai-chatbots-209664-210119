import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { SessionStore } from '../../core/session.store';
import type { Role } from '../../core/models';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="container" style="max-width: 560px; padding-top: 40px;">
      <div class="card" style="padding: 18px;">
        <h1 style="margin: 0 0 4px 0;">Create account</h1>
        <p class="muted" style="margin: 0 0 14px 0;">Choose a role for demo purposes.</p>

        <div style="display: grid; gap: 10px;">
          <div>
            <div class="label">Email</div>
            <input class="input" type="email" [(ngModel)]="email" autocomplete="email" />
          </div>

          <div>
            <div class="label">Password</div>
            <input class="input" type="password" [(ngModel)]="password" autocomplete="new-password" />
          </div>

          <div>
            <div class="label">Role</div>
            <select class="input" [(ngModel)]="role">
              <option value="customer">Customer</option>
              <option value="agent">Agent</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          @if (error()) {
            <div class="badge danger">{{ error() }}</div>
          }

          <div class="row" style="justify-content: space-between;">
            <a routerLink="/login" class="muted">Back to login</a>
            <button class="btn primary" type="button" (click)="onSubmit()" [disabled]="loading()">
              {{ loading() ? 'Creating...' : 'Create account' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class RegisterPageComponent {
  private api = inject(ApiService);
  private session = inject(SessionStore);
  private router = inject(Router);

  email = '';
  password = '';
  role: Role = 'customer';

  loading = signal(false);
  error = signal<string | null>(null);

  onSubmit() {
    this.error.set(null);
    this.loading.set(true);

    this.api.register({ email: this.email.trim(), password: this.password, role: this.role }).subscribe({
      next: ({ tokens, user }) => {
        this.session.setSession(tokens.accessToken, user);
        this.router.navigateByUrl('/app');
      },
      error: (err) => {
        const msg = err?.error?.detail ?? 'Registration failed';
        this.error.set(String(msg));
        this.loading.set(false);
      }
    });
  }
}
