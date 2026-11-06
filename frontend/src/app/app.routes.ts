import { Routes } from '@angular/router';
import { VentasComponent } from './features/ventas/ventas.component';
import { ProductosComponent } from './features/productos/productos.component';
import { VendedoresComponent } from './features/vendedores/vendedores.component';

export const routes: Routes = [
  { path: '', redirectTo: 'ventas', pathMatch: 'full' },
  { path: 'ventas', component: VentasComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'vendedores', component: VendedoresComponent },
];
