import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import type { AuthTokens, Ticket, User } from './models';

type LoginRequest = { email: string; password: string };
type RegisterRequest = { email: string; password: string; role?: 'customer' | 'agent' | 'admin' };

@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private base = environment.apiBaseUrl;

  // PUBLIC_INTERFACE
  /** Perform login; expected to return {accessToken, user}. */
  login(payload: LoginRequest) {
    return this.http.post<{ tokens: AuthTokens; user: User }>(`${this.base}/api/v1/auth/login`, payload);
  }

  // PUBLIC_INTERFACE
  /** Perform registration; expected to return {accessToken, user} or similar. */
  register(payload: RegisterRequest) {
    return this.http.post<{ tokens: AuthTokens; user: User }>(`${this.base}/api/v1/auth/register`, payload);
  }

  // PUBLIC_INTERFACE
  /** Fetch current session user (optional endpoint). */
  me() {
    return this.http.get<User>(`${this.base}/api/v1/auth/me`);
  }

  // PUBLIC_INTERFACE
  /** List tickets visible to the current user. */
  listTickets() {
    return this.http.get<Ticket[]>(`${this.base}/api/v1/tickets`);
  }

  // PUBLIC_INTERFACE
  /** Create a new support ticket. */
  createTicket(payload: { title: string; description: string }) {
    return this.http.post<Ticket>(`${this.base}/api/v1/tickets`, payload);
  }

  // PUBLIC_INTERFACE
  /** Get details of a ticket. */
  getTicket(id: string) {
    return this.http.get<Ticket>(`${this.base}/api/v1/tickets/${encodeURIComponent(id)}`);
  }

  // PUBLIC_INTERFACE
  /** Update a ticket (status/priority/assignment). */
  updateTicket(
    id: string,
    payload: Partial<Pick<Ticket, 'status' | 'priority'>> & { assigneeEmail?: string | null }
  ) {
    return this.http.patch<Ticket>(`${this.base}/api/v1/tickets/${encodeURIComponent(id)}`, payload);
  }
}
