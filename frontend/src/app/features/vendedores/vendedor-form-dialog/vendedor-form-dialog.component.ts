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
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { VendedorService } from '../../../services/vendedor.service';
import { Vendedor, VendedorInput } from '../../../core/models';

@Component({
  selector: 'app-vendedor-form-dialog',
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSlideToggleModule,
    MatButtonModule,
  ],
  templateUrl: './vendedor-form-dialog.component.html',
  styleUrl: './vendedor-form-dialog.component.css',
})
export class VendedorFormDialogComponent {
  private readonly fb = inject(FormBuilder);
  private readonly service = inject(VendedorService);
  private readonly dialogRef = inject(
    MatDialogRef<VendedorFormDialogComponent, boolean>,
  );
  readonly vendedor = inject<Vendedor | null>(MAT_DIALOG_DATA);

  readonly guardando = signal(false);

  readonly form = this.fb.nonNullable.group({
    nombre: ['', [Validators.required, Validators.maxLength(100)]],
    identificacion: ['', [Validators.required, Validators.maxLength(20)]],
    email: [
      '',
      [Validators.required, Validators.email, Validators.maxLength(100)],
    ],
    telefono: ['', [Validators.maxLength(20)]],
    activo: [true],
  });

  constructor() {
    if (this.vendedor) {
      this.form.patchValue({
        ...this.vendedor,
        telefono: this.vendedor.telefono ?? '',
      });
    }
  }

  guardar() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const { telefono, ...resto } = this.form.getRawValue();
    const datos: VendedorInput = { ...resto, telefono: telefono || null };

    this.guardando.set(true);

    const peticion = this.vendedor
      ? this.service.actualizar(this.vendedor.id, datos)
      : this.service.crear(datos);

    peticion.subscribe({
      next: () => this.dialogRef.close(true),
      error: () => this.guardando.set(false),
    });
  }
}
