import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const roleGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const requiredRoles = route.data['roles'] as string[];
  const userRole = authService.getUserRole();

  if (!authService.isAuthenticated()) {
    router.navigate(['/login']);
    return false;
  }

  if (requiredRoles && userRole && requiredRoles.includes(userRole)) {
    return true;
  }

  // Si no tiene el rol necesario, redirige al dashboard
  alert('No tienes permisos para acceder a esta página');
  router.navigate(['/dashboard']);
  return false;
};