import { Component, OnInit, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Vendedor } from '../../core/models';
import { VendedorService } from '../../services/vendedor.service';
import { ConfirmDialogComponent } from '../../shared/confirm-dialog/confirm-dialog.component';
import { VendedorFormDialogComponent } from './vendedor-form-dialog/vendedor-form-dialog.component';

@Component({
  selector: 'app-vendedores',
  imports: [
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatProgressBarModule,
  ],
  templateUrl: './vendedores.component.html',
  styleUrl: './vendedores.component.css',
})
export class VendedoresComponent implements OnInit {
  private readonly service = inject(VendedorService);
  private readonly dialog = inject(MatDialog);
  private readonly snackBar = inject(MatSnackBar);

  readonly columnas = [
    'nombre',
    'identificacion',
    'email',
    'telefono',
    'activo',
    'acciones',
  ];
  readonly vendedores = signal<Vendedor[]>([]);
  readonly cargando = signal(false);

  ngOnInit() {
    this.cargar();
  }

  cargar() {
    this.cargando.set(true);
    this.service.listar().subscribe({
      next: (datos) => {
        this.vendedores.set(datos);
        this.cargando.set(false);
      },
      error: () => this.cargando.set(false),
    });
  }

  abrirFormulario(vendedor: Vendedor | null = null) {
    this.dialog
      .open(VendedorFormDialogComponent, { data: vendedor })
      .afterClosed()
      .subscribe((guardado) => {
        if (guardado) {
          this.snackBar.open('Vendedor guardado', 'Cerrar', { duration: 3000 });
          this.cargar();
        }
      });
  }

  eliminar(vendedor: Vendedor) {
    this.dialog
      .open(ConfirmDialogComponent, {
        data: {
          titulo: 'Eliminar vendedor',
          mensaje: `¿Eliminar a ${vendedor.nombre}?`,
        },
      })
      .afterClosed()
      .subscribe((confirmado) => {
        if (!confirmado) return;
        this.service.eliminar(vendedor.id).subscribe(() => {
          this.snackBar.open('Vendedor eliminado', 'Cerrar', {
            duration: 3000,
          });
          this.cargar();
        });
      });
  }
}
