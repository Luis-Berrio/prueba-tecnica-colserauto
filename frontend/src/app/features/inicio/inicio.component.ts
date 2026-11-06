import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Producto, Vendedor, Venta } from '../../core/models';
import { ProductoService } from '../../services/producto.service';
import { VendedorService } from '../../services/vendedor.service';
import { VentaService } from '../../services/venta.service';

const STOCK_BAJO = 15;

@Component({
  selector: 'app-inicio',
  imports: [CurrencyPipe, DatePipe, MatIconModule, MatProgressBarModule, RouterLink],
  templateUrl: './inicio.component.html',
  styleUrl: './inicio.component.css',
})
export class InicioComponent implements OnInit {
  private readonly ventaService = inject(VentaService);
  private readonly productoService = inject(ProductoService);
  private readonly vendedorService = inject(VendedorService);

  readonly cargando = signal(true);
  readonly ventas = signal<Venta[]>([]);
  readonly productos = signal<Producto[]>([]);
  readonly vendedores = signal<Vendedor[]>([]);

  readonly totalVendido = computed(() =>
    this.ventas().reduce((suma, venta) => suma + Number(venta.total), 0),
  );
  readonly productosStockBajo = computed(() =>
    this.productos()
      .filter((p) => p.stock <= STOCK_BAJO)
      .sort((a, b) => a.stock - b.stock),
  );
  readonly vendedoresActivos = computed(() => this.vendedores().filter((v) => v.activo).length);
  readonly ultimasVentas = computed(() =>
    [...this.ventas()].sort((a, b) => b.id - a.id).slice(0, 5),
  );
  readonly umbral = STOCK_BAJO;

  ngOnInit() {
    forkJoin({
      ventas: this.ventaService.listar(),
      productos: this.productoService.listar(),
      vendedores: this.vendedorService.listar(),
    }).subscribe({
      next: ({ ventas, productos, vendedores }) => {
        this.ventas.set(ventas);
        this.productos.set(productos);
        this.vendedores.set(vendedores);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }
}
