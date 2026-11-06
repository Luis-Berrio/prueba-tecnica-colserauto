import { Routes } from '@angular/router';
import { InicioComponent } from './features/inicio/inicio.component';
import { ProductosComponent } from './features/productos/productos.component';
import { VendedoresComponent } from './features/vendedores/vendedores.component';
import { VentasComponent } from './features/ventas/ventas.component';

export const routes: Routes = [
  { path: '', redirectTo: 'inicio', pathMatch: 'full' },
  { path: 'inicio', component: InicioComponent },
  { path: 'ventas', component: VentasComponent },
  { path: 'productos', component: ProductosComponent },
  { path: 'vendedores', component: VendedoresComponent },
];
