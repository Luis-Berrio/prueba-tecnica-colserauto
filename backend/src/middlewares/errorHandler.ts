import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { HttpError } from "../errors/HttpError.js";
import { Prisma } from "../generated/prisma/client.js";

function sendError(
  res: Response,
  status: number,
  message: string,
  details?: unknown,
): void {
  res
    .status(status)
    .json({ error: { message, ...(details !== undefined && { details }) } });
}

// Mensajes para el usuario según qué restricción de la base de datos se violó.
const MENSAJES_DUPLICADO: Record<string, string> = {
  vendedor_identificacion_key: "Ya existe un vendedor con esa identificación",
  vendedor_email_key: "Ya existe un vendedor con ese correo",
  producto_codigo_key: "Ya existe un producto con ese código",
};

// Al borrar un registro que otras tablas usan: el modelo indica cuál se intentó borrar.
const MENSAJES_CON_VENTAS: Record<string, string> = {
  vendedor:
    "No se puede eliminar el vendedor porque tiene ventas registradas. Elimina esas ventas primero.",
  producto:
    "No se puede eliminar el producto porque tiene ventas registradas. Elimina esas ventas primero.",
};

// Con el adaptador de PostgreSQL, el nombre de la restricción viaja dentro de meta.
function nombreRestriccion(err: Prisma.PrismaClientKnownRequestError): string | undefined {
  const adaptador = err.meta?.driverAdapterError as
    | { cause?: { constraint?: { index?: string } } }
    | undefined;
  return adaptador?.cause?.constraint?.index;
}

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof HttpError) {
    sendError(res, err.statusCode, err.message);
    return;
  }

  if (err instanceof ZodError) {
    const details = err.issues.map((issue) => ({
      campo: issue.path.map(String).join("."),
      mensaje: issue.message,
    }));
    sendError(res, 400, "Datos inválidos", details);
    return;
  }

  if (err instanceof SyntaxError) {
    sendError(res, 400, "JSON inválido");
    return;
  }

  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    switch (err.code) {
      case "P2002": {
        const restriccion = nombreRestriccion(err) ?? "";
        sendError(
          res,
          409,
          MENSAJES_DUPLICADO[restriccion] ?? "Ya existe un registro con ese valor",
        );
        return;
      }
      case "P2003": {
        const modelo = String(err.meta?.modelName ?? "");
        sendError(
          res,
          409,
          MENSAJES_CON_VENTAS[modelo] ??
            "No se puede completar la operación porque el registro está relacionado con otros",
        );
        return;
      }
      case "P2025":
        sendError(res, 404, "Registro no encontrado");
        return;
      case "P2039":
        sendError(
          res,
          400,
          "Los datos no cumplen las reglas de la base de datos",
        );
        return;
    }
  }

  console.error(err);
  sendError(res, 500, "Error interno del servidor");
}
