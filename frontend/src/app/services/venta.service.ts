import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../core/api.config';
import { Venta, VentaInput } from '../core/models';

@Injectable({ providedIn: 'root' })
export class VentaService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/ventas`;

  listar() {
    return this.http.get<Venta[]>(this.url);
  }

  crear(datos: VentaInput) {
    return this.http.post<Venta>(this.url, datos);
  }

  actualizar(id: number, datos: VentaInput) {
    return this.http.put<Venta>(`${this.url}/${id}`, datos);
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
