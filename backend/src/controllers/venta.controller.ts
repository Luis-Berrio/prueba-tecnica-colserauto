import type { Request, Response } from "express";
import { idParamSchema } from "../schemas/common.schema.js";
import { ventaSchema } from "../schemas/venta.schema.js";
import { ventaService } from "../services/venta.service.js";

export const ventaController = {
  async listar(_req: Request, res: Response) {
    res.json(await ventaService.listar());
  },

  async obtener(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    res.json(await ventaService.obtener(id));
  },

  async crear(req: Request, res: Response) {
    const data = ventaSchema.parse(req.body);
    res.status(201).json(await ventaService.crear(data));
  },

  async actualizar(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    const data = ventaSchema.parse(req.body);
    res.json(await ventaService.actualizar(id, data));
  },

  async eliminar(req: Request, res: Response) {
    const { id } = idParamSchema.parse(req.params);
    await ventaService.eliminar(id);
    res.status(204).send();
  },
};
