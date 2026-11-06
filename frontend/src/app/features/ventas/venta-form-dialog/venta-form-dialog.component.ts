import { CurrencyPipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { forkJoin } from 'rxjs';
import { Producto, Vendedor, Venta, VentaInput } from '../../../core/models';
import { VendedorService } from '../../../services/vendedor.service';
import { VentaService } from '../../../services/venta.service';
import { ProductoService } from '../../../services/producto.service';

@Component({
  selector: 'app-venta-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    CurrencyPipe,
  ],
  templateUrl: './venta-form-dialog.component.html',
  styleUrl: './venta-form-dialog.component.css',
})
export class VentaFormDialogComponent implements OnInit {
  private readonly fb = inject(FormBuilder);
  private readonly ventaService = inject(VentaService);
  private readonly vendedorService = inject(VendedorService);
  private readonly productoService = inject(ProductoService);
  private readonly dialogRef = inject(
    MatDialogRef<VentaFormDialogComponent, boolean>,
  );
  readonly venta = inject<Venta | null>(MAT_DIALOG_DATA);

  readonly vendedores = signal<Vendedor[]>([]);
  readonly productos = signal<Producto[]>([]);
  readonly guardando = signal(false);

  readonly form = this.fb.group({
    vendedor_id: this.fb.control<number | null>(null, [Validators.required]),
    producto_id: this.fb.control<number | null>(null, [Validators.required]),
    cantidad: this.fb.control<number | null>(1, [
      Validators.required,
      Validators.min(1),
      Validators.pattern(/^\d+$/),
    ]),
  });

  private readonly valores = toSignal(this.form.valueChanges, {
    initialValue: this.form.getRawValue(),
  });

  readonly productoSeleccionado = computed(() =>
    this.productos().find((p) => p.id === this.valores().producto_id),
  );

  readonly totalEstimado = computed(() => {
    const producto = this.productoSeleccionado();
    if (!producto) return 0;
    const precio =
      this.venta && this.venta.producto_id === producto.id
        ? Number(this.venta.precio_unitario)
        : Number(producto.precio);
    return precio * Number(this.valores().cantidad ?? 0);
  });

  ngOnInit() {
    if (this.venta) {
      this.form.patchValue({
        vendedor_id: this.venta.vendedor_id,
        producto_id: this.venta.producto_id,
        cantidad: this.venta.cantidad,
      });
    }

    forkJoin({
      vendedores: this.vendedorService.listar(),
      productos: this.productoService.listar(),
    }).subscribe(({ vendedores, productos }) => {
      this.vendedores.set(
        vendedores.filter((v) => v.activo || v.id === this.venta?.vendedor_id),
      );
      this.productos.set(productos);
    });
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const datos: VentaInput = {
      vendedor_id: Number(v.vendedor_id),
      producto_id: Number(v.producto_id),
      cantidad: Number(v.cantidad),
    };

    this.guardando.set(true);
    const peticion = this.venta
      ? this.ventaService.actualizar(this.venta.id, datos)
      : this.ventaService.crear(datos);

    peticion.subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.guardando.set(false),
    });
  }
}
