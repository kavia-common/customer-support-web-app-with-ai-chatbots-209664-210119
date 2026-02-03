import { Injectable, signal, computed } from '@angular/core';
import type { Role, User } from './models';

type SessionState = {
  accessToken: string | null;
  user: User | null;
};

const LS_KEY = 'cs_session_v1';

function safeParse(value: string | null): SessionState | null {
  if (!value) return null;
  try {
    return JSON.parse(value) as SessionState;
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class SessionStore {
  private state = signal<SessionState>({ accessToken: null, user: null });

  readonly accessToken = computed(() => this.state().accessToken);
  readonly user = computed(() => this.state().user);
  readonly role = computed<Role | null>(() => this.state().user?.role ?? null);
  readonly isAuthenticated = computed(() => !!this.state().accessToken);

  constructor() {
    const fromLs = safeParse(localStorage.getItem(LS_KEY));
    if (fromLs) this.state.set(fromLs);
  }

  // PUBLIC_INTERFACE
  /** Save token and user payload into session storage. */
  setSession(accessToken: string, user: User) {
    const next = { accessToken, user };
    this.state.set(next);
    localStorage.setItem(LS_KEY, JSON.stringify(next));
  }

  // PUBLIC_INTERFACE
  /** Clears local session (logout). */
  clear() {
    this.state.set({ accessToken: null, user: null });
    localStorage.removeItem(LS_KEY);
  }
}
