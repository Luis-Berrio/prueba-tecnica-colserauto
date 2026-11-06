import { Router } from "express";
import { ventaController } from "../controllers/venta.controller.js";

export const ventaRoutes = Router();

ventaRoutes.get("/", ventaController.listar);
ventaRoutes.get("/:id", ventaController.obtener);
ventaRoutes.post("/", ventaController.crear);
ventaRoutes.put("/:id", ventaController.actualizar);
ventaRoutes.delete("/:id", ventaController.eliminar);
