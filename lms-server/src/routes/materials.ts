import express from "express";
import {
  createMaterial,
  deleteMaterial,
  getAllMaterials,
  getMaterialById,
  updateMaterial,
} from "../controllers/materials.js";
import { admintrainerAuthenticator } from "../middlewares/admintrainerAuthenticator.js";

const materialRouter = express.Router();

materialRouter.post(
  "/createMaterial",
  admintrainerAuthenticator,
  createMaterial
);
materialRouter.get(
  "/getAllMaterials",
  admintrainerAuthenticator,
  getAllMaterials
);
materialRouter.get(
  "/getMaterialById/:id",
  admintrainerAuthenticator,
  getMaterialById
);
materialRouter.put(
  "/updateMaterial/:id",
  admintrainerAuthenticator,
  updateMaterial
);
materialRouter.delete(
  "/deleteMaterial/:id",
  admintrainerAuthenticator,
  deleteMaterial
);

export default materialRouter;
