import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProductosService, Producto } from '../productos.service';
import { AuthService } from '../../../core/services/auth.service';

@Component({
  selector: 'app-lista-productos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lista-productos.component.html',
  styleUrl: './lista-productos.component.css'
})
export class ListaProductosComponent implements OnInit {
  productos: Producto[] = [];
  loading: boolean = false;
  errorMessage: string = '';
  userRole: string | null = null;

  constructor(
    private productosService: ProductosService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.userRole = this.authService.getUserRole();
    this.cargarProductos();
  }

  cargarProductos(): void {
    this.loading = true;
    this.errorMessage = '';

    this.productosService.obtenerProductos().subscribe({
      next: (response) => {
        console.log('Productos:', response);
        this.productos = response.data || response;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error al cargar productos:', error);
        this.errorMessage = 'Error al cargar los productos';
        this.loading = false;
      }
    });
  }

  crearProducto(): void {
    this.router.navigate(['/productos/crear']);
  }

  editarProducto(id: number): void {
    this.router.navigate([`/productos/editar/${id}`]);
  }

  eliminarProducto(id: number): void {
    if (confirm('¿Estás seguro de eliminar este producto?')) {
      this.productosService.eliminarProducto(id).subscribe({
        next: () => {
          alert('Producto eliminado correctamente');
          this.cargarProductos(); // Recargar la lista
        },
        error: (error) => {
          console.error('Error al eliminar:', error);
          alert('Error al eliminar el producto');
        }
      });
    }
  }

  volver(): void {
    this.router.navigate(['/dashboard']);
  }
}