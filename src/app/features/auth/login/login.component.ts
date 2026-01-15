import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../core/services/auth.service';
import { environment } from '../../../../environments/environment'; // ← NUEVO

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {
  email: string = '';
  password: string = '';
  loading: boolean = false;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private cdr: ChangeDetectorRef
  ) {}

  onSubmit() {
    this.errorMessage = '';

    if (!this.email || !this.password) {
      this.errorMessage = 'Por favor complete todos los campos';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.email)) {
      this.errorMessage = 'Por favor ingrese un email válido';
      return;
    }

    this.loading = true;

    this.authService.login(this.email, this.password).subscribe({
      next: (response) => {
        // ✅ Log solo en desarrollo
        if (environment.enableLogs) {
          console.log('✅ Login exitoso:', response);
        }
        this.loading = false;
        this.router.navigate(['/dashboard']);
      },
      error: (error) => {
        // ✅ Log solo en desarrollo
        if (environment.enableLogs) {
          console.error('❌ Error de login:', error);
          console.log('ErrorMessage actual:', this.errorMessage);
          console.log('Loading actual:', this.loading);
        }

        this.loading = false;

        if (error.status === 401) {
          this.errorMessage = '❌ Credenciales incorrectas. Verifica tu email y contraseña.';
        } else if (error.status === 422) {
          this.errorMessage = '⚠️ Datos inválidos. Verifica tu email y contraseña.';
        } else if (error.status === 500) {
          this.errorMessage = '🔥 Error del servidor. Intenta nuevamente más tarde.';
        } else if (error.status === 0) {
          this.errorMessage = '🌐 No se pudo conectar al servidor. Verifica tu conexión.';
        } else {
          // ❌ NO mostrar el mensaje de error del backend en producción
          this.errorMessage = '❌ Error al iniciar sesión. Intenta nuevamente.';
        }

        this.cdr.detectChanges();
      }
    });
  }
}