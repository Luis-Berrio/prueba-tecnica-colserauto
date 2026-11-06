import { z } from "zod";

export const vendedorSchema = z.object({
  nombre: z.string().trim().min(1).max(100),
  identificacion: z.string().trim().min(1).max(20),
  email: z.email().max(100),
  telefono: z.string().trim().max(20).nullish(),
  activo: z.boolean().default(true),
});

export type VendedorInput = z.infer<typeof vendedorSchema>;

export const idParamSchema = z.object({
  id: z.coerce.number().int().positive(),
});
