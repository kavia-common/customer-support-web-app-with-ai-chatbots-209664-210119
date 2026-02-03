import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SessionStore } from './session.store';

// PUBLIC_INTERFACE
/** Guards routes requiring authentication. */
export const authGuard: CanActivateFn = () => {
  const session = inject(SessionStore);
  const router = inject(Router);

  if (session.isAuthenticated()) return true;
  return router.parseUrl('/login');
};
