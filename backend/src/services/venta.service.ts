import { HttpError } from "../errors/HttpError.js";
import { Prisma } from "../generated/prisma/client.js";
import { prisma } from "../lib/prisma.js";
import { VentaInput } from "../schemas/venta.schema.js";

type Tx = Prisma.TransactionClient;

const include = { vendedor: true, producto: true } as const;

async function reservarStock(tx: Tx, input: VentaInput) {
  const vendedor = await tx.vendedor.findUnique({
    where: { id: input.vendedor_id },
  });

  if (!vendedor) {
    throw new HttpError(404, "Vendedor no encontrado");
  }

  if (!vendedor.activo) {
    throw new HttpError(409, "El vendedor está inactivo");
  }

  const producto = await tx.producto.findUnique({
    where: { id: input.producto_id },
  });

  if (!producto) {
    throw new HttpError(404, "Producto no encontrado");
  }

  const { count } = await tx.producto.updateMany({
    where: { id: producto.id, stock: { gte: input.cantidad } },
    data: { stock: { decrement: input.cantidad } },
  });

  if (count === 0) {
    throw new HttpError(409, "Stock insuficiente");
  }

  return producto;
}

export const ventaService = {
  listar: () =>
    prisma.venta.findMany({
      include,
      orderBy: { id: "asc" },
    }),

  async obtener(id: number) {
    const venta = await prisma.venta.findUnique({
      where: { id },
      include,
    });

    if (!venta) {
      throw new HttpError(404, "Venta no encontrada");
    }
    return venta;
  },

  crear: (input: VentaInput) =>
    prisma.$transaction(async (tx) => {
      const producto = await reservarStock(tx, input);
      return tx.venta.create({
        data: {
          vendedor_id: input.vendedor_id,
          producto_id: input.producto_id,
          cantidad: input.cantidad,
          precio_unitario: producto.precio,
          total: producto.precio.mul(input.cantidad),
        },
        include,
      });
    }),

  actualizar: (id: number, input: VentaInput) =>
    prisma.$transaction(async (tx) => {
      const anterior = await tx.venta.findUnique({
        where: { id },
      });

      if (!anterior) {
        throw new HttpError(404, "Venta no encontrada");
      }

      await tx.producto.update({
        where: { id: anterior.producto_id },
        data: {
          stock: {
            increment: anterior.cantidad,
          },
        },
      });

      const producto = await reservarStock(tx, input);

      const precioUnitario =
        producto.id === anterior.producto_id
          ? anterior.precio_unitario
          : producto.precio;

      return tx.venta.update({
        where: { id },
        data: {
          vendedor_id: input.vendedor_id,
          producto_id: input.producto_id,
          cantidad: input.cantidad,
          precio_unitario: precioUnitario,
          total: producto.precio.mul(input.cantidad),
        },
        include,
      });
    }),

  eliminar: (id: number) =>
    prisma.$transaction(async (tx) => {
      const venta = await tx.venta.findUnique({
        where: { id },
      });

      if (!venta) {
        throw new HttpError(404, "Venta no encontrada");
      }

      await tx.producto.update({
        where: { id: venta.producto_id },
        data: { stock: { increment: venta.cantidad } },
      });

      await tx.venta.delete({ where: { id } });
    }),
};
