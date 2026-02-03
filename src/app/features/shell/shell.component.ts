import { Component, computed, inject } from '@angular/core';
import { RouterLink, RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { SessionStore } from '../../core/session.store';

@Component({
  standalone: true,
  selector: 'app-shell',
  imports: [RouterLink, RouterOutlet],
  styles: [
    `
      header {
        position: sticky;
        top: 0;
        z-index: 10;
        backdrop-filter: blur(10px);
        background: rgba(11, 18, 32, 0.7);
        border-bottom: 1px solid rgba(255, 255, 255, 0.08);
      }
      .nav {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: 12px 16px;
        gap: 12px;
      }
      .brand {
        display: flex;
        align-items: center;
        gap: 10px;
        font-weight: 700;
        letter-spacing: 0.2px;
      }
      .brand .dot {
        width: 10px;
        height: 10px;
        border-radius: 999px;
        background: var(--brand);
        box-shadow: 0 0 0 4px rgba(96, 165, 250, 0.15);
      }
      nav {
        display: flex;
        gap: 10px;
        align-items: center;
        flex-wrap: wrap;
      }
      .link {
        padding: 8px 10px;
        border-radius: 10px;
        border: 1px solid transparent;
        color: var(--muted);
      }
      .link.active {
        color: var(--text);
        background: rgba(255, 255, 255, 0.06);
        border-color: rgba(255, 255, 255, 0.08);
      }
      .right {
        display: flex;
        gap: 12px;
        align-items: center;
      }
      .email {
        color: var(--muted);
        font-size: 13px;
      }
    `
  ],
  template: `
    <header>
      <div class="nav container">
        <div class="brand">
          <span class="dot"></span>
          <a routerLink="/app/dashboard">Support Desk</a>
        </div>

        <nav>
          <a class="link" [class.active]="activePath() === '/app/dashboard'" routerLink="/app/dashboard">Dashboard</a>
          <a class="link" [class.active]="activePath() === '/app/tickets'" routerLink="/app/tickets">Tickets</a>
          <a class="link" [class.active]="activePath() === '/app/chat'" routerLink="/app/chat">Chat</a>
          @if (isAdmin()) {
            <a class="link" [class.active]="activePath() === '/app/admin'" routerLink="/app/admin">Admin</a>
          }
        </nav>

        <div class="right">
          <span class="email">{{ userEmail() }}</span>
          <button class="btn danger" type="button" (click)="logout()">Logout</button>
        </div>
      </div>
    </header>

    <main class="container" style="padding-top: 16px;">
      <router-outlet />
    </main>
  `
})
export class ShellComponent {
  private router = inject(Router);
  private session = inject(SessionStore);

  readonly userEmail = computed(() => this.session.user()?.email ?? '—');
  readonly isAdmin = computed(() => this.session.role() === 'admin');

  readonly activePath = signalPath(this.router);

  logout() {
    this.session.clear();
    this.router.navigateByUrl('/login');
  }
}

function signalPath(router: Router) {
  const s = signal<string>(router.url);
  router.events.pipe(filter((e) => e instanceof NavigationEnd)).subscribe(() => s.set(router.url));
  return s;
}
