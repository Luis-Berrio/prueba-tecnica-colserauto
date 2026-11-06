import { z } from "zod";

export const productoSchema = z.object({
  codigo: z.string().trim().min(1).max(20),
  nombre: z.string().trim().min(1).max(100),
  descripcion: z.string().trim().nullish(),
  precio: z.number().min(0).max(9_999_999_999.99),
  stock: z.number().min(1).max(2_000_000_000).default(0),
});

export type ProductoInput = z.infer<typeof productoSchema>;
