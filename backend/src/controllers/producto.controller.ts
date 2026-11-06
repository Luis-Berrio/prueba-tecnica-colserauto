import { Request, Response } from "express";
import { productoService } from "../services/producto.service.js";
import { idParamSchema } from "../schemas/common.schema.js";
import { productoSchema } from "../schemas/producto.schema.js";

export const productoController = {
  async listar(_req: Request, res: Response) {
    res.json(await productoService.listar());
  },

  async obtener(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    res.json(await productoService.obtener(id));
  },

  async crear(req: Request, res: Response) {
    const data = productoSchema.parse(req.body);
    const producto = await productoService.crear(data);
    res.status(201).json(producto);
  },

  async actualizar(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    const data = productoSchema.parse(req.body);
    res.json(await productoService.actualizar(id, data));
  },

  async eliminar(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    await productoService.eliminar(id);
    res.status(204).send();
  },
};
