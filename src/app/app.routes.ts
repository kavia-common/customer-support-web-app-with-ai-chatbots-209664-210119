import { Routes } from '@angular/router';

import { LoginPageComponent } from './features/auth/login-page.component';
import { RegisterPageComponent } from './features/auth/register-page.component';
import { ShellComponent } from './features/shell/shell.component';
import { DashboardPageComponent } from './features/dashboard/dashboard-page.component';
import { TicketsPageComponent } from './features/tickets/tickets-page.component';
import { TicketDetailPageComponent } from './features/tickets/ticket-detail-page.component';
import { ChatPageComponent } from './features/chat/chat-page.component';
import { authGuard } from './core/auth.guard';
import { roleGuard } from './core/role.guard';

// PUBLIC_INTERFACE
/**
 * Application routes.
 */
export const routes: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'app' },
  { path: 'login', component: LoginPageComponent, title: 'Login' },
  { path: 'register', component: RegisterPageComponent, title: 'Create account' },
  {
    path: 'app',
    component: ShellComponent,
    canActivate: [authGuard],
    children: [
      { path: '', pathMatch: 'full', redirectTo: 'dashboard' },
      { path: 'dashboard', component: DashboardPageComponent, title: 'Dashboard' },
      { path: 'tickets', component: TicketsPageComponent, title: 'Tickets' },
      { path: 'tickets/:id', component: TicketDetailPageComponent, title: 'Ticket details' },
      { path: 'chat', component: ChatPageComponent, title: 'Chat' },
      {
        path: 'admin',
        title: 'Admin',
        canActivate: [roleGuard],
        data: { roles: ['admin'] as const },
        loadComponent: async () => (await import('./features/admin/admin-page.component')).AdminPageComponent
      }
    ]
  },
  { path: '**', redirectTo: 'app' }
];
