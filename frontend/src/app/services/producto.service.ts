import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../core/api.config';
import { Producto, ProductoInput } from '../core/models';

@Injectable({ providedIn: 'root' })
export class ProductoService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/Productos`;

  listar() {
    return this.http.get<Producto[]>(this.url);
  }

  crear(datos: ProductoInput) {
    return this.http.post<Producto>(this.url, datos);
  }

  actualizar(id: number, datos: ProductoInput) {
    return this.http.put<Producto>(`${this.url}/${id}`, datos);
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
