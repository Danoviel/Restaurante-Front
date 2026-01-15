import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiService } from '../../core/services/api.service';

export interface Producto {
  id?: number;
  nombre: string;
  descripcion?: string;
  precio: number;
  stock?: number;
  categoria_id: number;
  tipo: 'comprado' | 'preparado';
  estado: 'activo' | 'inactivo';
  imagen?: string;
  categoria?: {
    id: number;
    nombre: string;
  };
}

export interface Categoria {
  id: number;
  nombre: string;
  descripcion?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProductosService {
  constructor(private apiService: ApiService) {}

  // Obtener todos los productos
  obtenerProductos(): Observable<any> {
    return this.apiService.get('productos');
  }

  // Obtener un producto por ID
  obtenerProducto(id: number): Observable<any> {
    return this.apiService.get(`productos/${id}`);
  }

  // Crear un producto
  crearProducto(producto: Producto): Observable<any> {
    return this.apiService.post('productos', producto);
  }

  // Actualizar un producto
  actualizarProducto(id: number, producto: Producto): Observable<any> {
    return this.apiService.put(`productos/${id}`, producto);
  }

  // Eliminar un producto
  eliminarProducto(id: number): Observable<any> {
    return this.apiService.delete(`productos/${id}`);
  }

  // Obtener todas las categorías
  obtenerCategorias(): Observable<any> {
    return this.apiService.get('categorias');
  }
}