import { CurrencyPipe, DatePipe } from '@angular/common';
import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Venta } from '../../core/models';
import { VentaService } from '../../services/venta.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { VentaFormDialogComponent } from './venta-form-dialog/venta-form-dialog.component';

@Component({
  selector: 'app-ventas',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
    CurrencyPipe,
    DatePipe,
  ],
  templateUrl: './ventas.component.html',
  styleUrl: './ventas.component.css',
})
export class VentasComponent implements OnInit {
  private readonly service = inject(VentaService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly columnas = [
    'id',
    'fecha',
    'vendedor',
    'producto',
    'cantidad',
    'precio',
    'total',
    'acciones',
  ];
  readonly ventas = signal<Venta[]>([]);
  readonly cargando = signal(false);

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.service.listar().subscribe({
      next: (datos) => {
        this.ventas.set(datos);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  abrirFormulario(venta: Venta | null = null) {
    this.dialog
      .open(VentaFormDialogComponent, { data: venta })
      .afterClosed()
      .subscribe((guardado) => {
        if (guardado) {
          this.snackBar.open('Venta guardada', 'Cerrar', { duration: 3000 });
          this.cargar();
        }
      });
  }

  eliminar(venta: Venta) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          titulo: 'Eliminar venta',
          mensaje: `¿Eliminar la venta #${venta.id}? El stock vuelve al producto.`,
        },
      })
      .afterClosed()
      .subscribe((confirmado) => {
        if (!confirmado) return;
        this.service.eliminar(venta.id).subscribe(() => {
          this.snackBar.open('Venta eliminada', 'Cerrar', { duration: 3000 });
          this.cargar();
        });
      });
  }
}
