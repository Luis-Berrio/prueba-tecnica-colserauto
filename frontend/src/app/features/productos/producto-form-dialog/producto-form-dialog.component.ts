import { Component, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { Producto, ProductoInput } from '../../../core/models';
import { ProductoService } from '../../../services/producto.service';

@Component({
  selector: 'app-producto-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
  ],
  templateUrl: './producto-form-dialog.component.html',
  styles: `
    .formulario {
      display: flex;
      flex-direction: column;
      min-width: 340px;
    }
  `,
})
export class ProductoFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(ProductoService);
  private readonly dialogRef = inject(
    MatDialogRef<ProductoFormDialogComponent, boolean>,
  );
  readonly producto = inject<Producto | null>(MAT_DIALOG_DATA);

  readonly guardando = signal(false);

  readonly form = this.fb.group({
    codigo: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(30),
    ]),
    nombre: this.fb.nonNullable.control('', [
      Validators.required,
      Validators.maxLength(150),
    ]),
    descripcion: this.fb.nonNullable.control(''),
    precio: this.fb.control<number | null>(null, [
      Validators.required,
      Validators.min(0),
    ]),
    stock: this.fb.control<number | null>(0, [
      Validators.required,
      Validators.min(0),
      Validators.pattern(/^\d+$/),
    ]),
  });

  constructor() {
    if (this.producto) {
      this.form.patchValue({
        codigo: this.producto.codigo,
        nombre: this.producto.nombre,
        descripcion: this.producto.descripcion ?? '',
        precio: Number(this.producto.precio),
        stock: this.producto.stock,
      });
    }
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const v = this.form.getRawValue();
    const datos: ProductoInput = {
      codigo: v.codigo,
      nombre: v.nombre,
      descripcion: v.descripcion || null,
      precio: Number(v.precio),
      stock: Number(v.stock),
    };

    this.guardando.set(true);
    const peticion = this.producto
      ? this.service.actualizar(this.producto.id, datos)
      : this.service.crear(datos);

    peticion.subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.guardando.set(false),
    });
  }
}
