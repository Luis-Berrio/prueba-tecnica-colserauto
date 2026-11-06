import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { catchError, throwError } from 'rxjs';

interface ApiError {
  error?: { message?: string; details?: { campo: string; mensaje: string }[] };
}

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const snackBar = inject(MatSnackBar);

  return next(req).pipe(
    catchError((respuesta: HttpErrorResponse) => {
      const cuerpo = respuesta.error as ApiError | null;
      let mensaje = 'Ocurrió un error inesperado';

      if (respuesta.status === 0) {
        mensaje = 'No se pudo conectar con el servidor';
      } else if (cuerpo?.error?.message) {
        mensaje = cuerpo.error.message;
        const detalles = cuerpo.error.details?.map(
          (d) => `${d.campo}: ${d.mensaje}`,
        );
        if (detalles?.length) {
          mensaje += ` (${detalles.join('; ')})`;
        }
      }

      snackBar.open(mensaje, 'Cerrar', { duration: 6000 });
      return throwError(() => respuesta);
    }),
  );
};
