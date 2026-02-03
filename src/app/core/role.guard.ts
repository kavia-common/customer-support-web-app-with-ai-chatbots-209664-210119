import { CanActivateFn, ActivatedRouteSnapshot, Router } from '@angular/router';
import { inject } from '@angular/core';
import { SessionStore } from './session.store';
import type { Role } from './models';

// PUBLIC_INTERFACE
/** Guards routes requiring one of the specified roles. */
export const roleGuard: CanActivateFn = (route: ActivatedRouteSnapshot) => {
  const session = inject(SessionStore);
  const router = inject(Router);

  const roles = (route.data['roles'] ?? []) as Role[];
  const role = session.role();

  if (!session.isAuthenticated()) return router.parseUrl('/login');
  if (!role) return router.parseUrl('/app');

  if (roles.includes(role)) return true;
  return router.parseUrl('/app');
};
