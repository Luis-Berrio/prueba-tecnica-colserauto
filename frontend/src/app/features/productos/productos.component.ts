import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Producto } from '../../core/models';
import { ProductoService } from '../../services/producto.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { ProductoFormDialogComponent } from './producto-form-dialog/producto-form-dialog.component';

@Component({
  selector: 'app-productos',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    CurrencyPipe,
  ],
  templateUrl: './productos.component.html',
  styleUrl: './productos.component.css',
})
export class ProductosComponent implements OnInit {
  private readonly service = inject(ProductoService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly columnas = [
    'codigo',
    'nombre',
    'descripcion',
    'precio',
    'stock',
    'acciones',
  ];
  readonly productos = signal<Producto[]>([]);
  readonly cargando = signal(false);

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.service.listar().subscribe({
      next: (datos) => {
        this.productos.set(datos);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  abrirFormulario(producto: Producto | null = null) {
    this.dialog
      .open(ProductoFormDialogComponent, { data: producto })
      .afterClosed()
      .subscribe((guardado) => {
        if (guardado) {
          this.snackBar.open('Producto guardado', 'Cerrar', { duration: 3000 });
          this.cargar();
        }
      });
  }

  eliminar(producto: Producto) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          titulo: 'Eliminar producto',
          mensaje: `¿Eliminar ${producto.nombre}?`,
        },
      })
      .afterClosed()
      .subscribe((confirmado) => {
        if (!confirmado) return;
        this.service.eliminar(producto.id).subscribe(() => {
          this.snackBar.open('Producto eliminado', 'Cerrar', {
            duration: 3000,
          });
          this.cargar();
        });
      });
  }
}
