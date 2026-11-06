import cors from "cors";
import express from "express";
import { HttpError } from "./errors/HttpError.js";
import { errorHandler } from "./middlewares/errorHandler.js";
import { vendedorRoutes } from "./routes/vendedor.routes.js";

export const app = express();

app.use(cors());
app.use(express.json());

app.get("/health", (_req, res) => {
  res.json({ status: "ok" });
});

app.use("/api/vendedores", vendedorRoutes);

app.use((_req, _res, next) => {
  next(new HttpError(404, "Ruta no encontrada"));
});

app.use(errorHandler);
