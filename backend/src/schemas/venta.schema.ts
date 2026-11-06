import { z } from "zod";

export const ventaSchema = z.object({
  vendedor_id: z.number().int().positive(),
  producto_id: z.number().int().positive(),
  cantidad: z.number().int().min(1).max(1_000_000),
});

export type VentaInput = z.infer<typeof ventaSchema>;
