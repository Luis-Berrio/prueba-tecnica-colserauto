import { Router } from "express";
import { vendedorController } from "../controllers/vendedor.controller.js";

export const vendedorRoutes = Router();

vendedorRoutes.get("/", vendedorController.listar);
vendedorRoutes.get("/:id", vendedorController.obtener);
vendedorRoutes.post("/", vendedorController.crear);
vendedorRoutes.put("/:id", vendedorController.actualizar);
vendedorRoutes.delete("/:id", vendedorController.eliminar);
