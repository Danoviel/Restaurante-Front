import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { PLATFORM_ID } from '@angular/core';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);
  const isBrowser = isPlatformBrowser(platformId);

  // Clonar la petición y agregar el token si existe
  let authReq = req;
  
  if (isBrowser) {
    const token = localStorage.getItem('token');
    
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }
  }

  // Enviar la petición y manejar errores globalmente
  return next(authReq).pipe(
    catchError((error) => {
      console.error('Error HTTP:', error);

      // 🔥 NUEVO: Detectar si es la ruta de login
      const isLoginRequest = req.url.includes('/auth/login');

      // Si es error 401 (No autorizado)
      if (error.status === 401) {
        // Si NO es el login, redirigir (sesión expirada)
        if (!isLoginRequest && isBrowser) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          alert('Tu sesión ha expirado. Por favor, inicia sesión nuevamente.');
          router.navigate(['/login']);
        }
        // Si ES el login, dejamos que el componente maneje el error
      }

      // Si es error 403 (Prohibido - sin permisos)
      if (error.status === 403) {
        alert('No tienes permisos para realizar esta acción');
      }

      // Si es error 500 (Error del servidor)
      if (error.status === 500) {
        alert('Error del servidor. Intenta nuevamente.');
      }

      // Devolver el error para que el componente lo maneje
      return throwError(() => error);
    })
  );
};