import { Request, Response } from "express";
import { vendedorService } from "../services/vendedor.service.js";
import { vendedorSchema } from "../schemas/vendedor.schema.js";
import { idParamSchema } from "../schemas/common.schema.js";

export const vendedorController = {
  async listar(_req: Request, res: Response) {
    res.json(await vendedorService.listar());
  },

  async obtener(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    res.json(await vendedorService.obtener(id));
  },

  async crear(req: Request, res: Response) {
    const data = vendedorSchema.parse(req.body);
    const vendedor = await vendedorService.crear(data);
    res.status(201).json(vendedor);
  },

  async actualizar(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    const data = vendedorSchema.parse(req.body);
    res.json(await vendedorService.actualizar(id, data));
  },

  async eliminar(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    await vendedorService.eliminar(id);
    res.status(204).send();
  },
};
