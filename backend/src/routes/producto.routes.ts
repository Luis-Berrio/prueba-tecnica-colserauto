import { Router } from "express";
import { productoController } from "../controllers/producto.controller.js";

export const productoRoutes = Router();

productoRoutes.get("/", productoController.listar);
productoRoutes.get("/:id", productoController.obtener);
productoRoutes.post("/", productoController.crear);
productoRoutes.put("/:id", productoController.actualizar);
productoRoutes.delete("/:id", productoController.eliminar);
