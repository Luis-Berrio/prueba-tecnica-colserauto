import { HttpError } from "../errors/HttpError.js";
import { prisma } from "../lib/prisma.js";
import { ProductoInput } from "../schemas/producto.schema.js";

export const productoService = {
  listar: () => prisma.producto.findMany({ orderBy: { id: "asc" } }),

  async obtener(id: number) {
    const producto = await prisma.producto.findUnique({ where: { id } });
    if (!producto) {
      throw new HttpError(404, "Producto no encontrado");
    }
    return producto;
  },

  crear: (data: ProductoInput) => prisma.producto.create({ data }),
  actualizar: (id: number, data: ProductoInput) =>
    prisma.producto.update({ where: { id }, data }),
  eliminar: (id: number) => prisma.producto.delete({ where: { id } }),
};
