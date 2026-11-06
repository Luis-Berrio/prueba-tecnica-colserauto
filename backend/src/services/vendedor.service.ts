import { HttpError } from "../errors/HttpError.js";
import { prisma } from "../lib/prisma.js";
import { VendedorInput } from "../schemas/vendedor.schema.js";

export const vendedorService = {
  listar: () => prisma.vendedor.findMany({ orderBy: { id: "asc" } }),

  async obtener(id: number) {
    const vendedor = await prisma.vendedor.findUnique({ where: { id } });
    if (!vendedor) {
      throw new HttpError(404, "Vendedor no encontrado");
    }
    return vendedor;
  },

  crear: (data: VendedorInput) => prisma.vendedor.create({ data }),
  actualizar: (id: number, data: VendedorInput) =>
    prisma.vendedor.update({ where: { id }, data }),
  eliminar: (id: number) => prisma.vendedor.delete({ where: { id } }),
};
