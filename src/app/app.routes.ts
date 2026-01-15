import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { roleGuard } from './core/guards/role.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./features/dashboard/dashboard.component').then(m => m.DashboardComponent),
    canActivate: [authGuard] 
  },
  {
    path: 'productos',
    loadComponent: () => import('./features/productos/lista/lista-productos.component').then(m => m.ListaProductosComponent),
    canActivate: [authGuard, roleGuard],
    data: { roles: ['Administrador', 'Cajero'] } 
  },
  {
    path: '**',
    redirectTo: '/login'
  }
];