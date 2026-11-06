import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { API_URL } from '../core/api.config';
import { Vendedor, VendedorInput } from '../core/models';

@Injectable({ providedIn: 'root' })
export class VendedorService {
  private readonly http = inject(HttpClient);
  private readonly url = `${API_URL}/vendedores`;

  listar() {
    return this.http.get<Vendedor[]>(this.url);
  }

  crear(datos: VendedorInput) {
    return this.http.post<Vendedor>(this.url, datos);
  }

  actualizar(id: number, datos: VendedorInput) {
    return this.http.put<Vendedor>(`${this.url}/${id}`, datos);
  }

  eliminar(id: number) {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
