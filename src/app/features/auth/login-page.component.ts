import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../../core/api.service';
import { SessionStore } from '../../core/session.store';

@Component({
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div class="container" style="max-width: 520px; padding-top: 40px;">
      <div class="card" style="padding: 18px;">
        <h1 style="margin: 0 0 4px 0;">Sign in</h1>
        <p class="muted" style="margin: 0 0 14px 0;">Use your account to access tickets and chat.</p>

        <div style="display: grid; gap: 10px;">
          <div>
            <div class="label">Email</div>
            <input class="input" type="email" [(ngModel)]="email" autocomplete="email" />
          </div>

          <div>
            <div class="label">Password</div>
            <input class="input" type="password" [(ngModel)]="password" autocomplete="current-password" />
          </div>

          @if (error()) {
            <div class="badge danger">{{ error() }}</div>
          }

          <div class="row" style="justify-content: space-between;">
            <a routerLink="/register" class="muted">Create an account</a>
            <button class="btn primary" type="button" (click)="onSubmit()" [disabled]="loading()">
              {{ loading() ? 'Signing in...' : 'Sign in' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class LoginPageComponent {
  private api = inject(ApiService);
  private session = inject(SessionStore);
  private router = inject(Router);

  email = '';
  password = '';

  loading = signal(false);
  error = signal<string | null>(null);

  onSubmit() {
    this.error.set(null);
    this.loading.set(true);

    this.api.login({ email: this.email.trim(), password: this.password }).subscribe({
      next: ({ tokens, user }) => {
        this.session.setSession(tokens.accessToken, user);
        this.router.navigateByUrl('/app');
      },
      error: (err) => {
        const msg = err?.error?.detail ?? 'Login failed';
        this.error.set(String(msg));
        this.loading.set(false);
      }
    });
  }
}
