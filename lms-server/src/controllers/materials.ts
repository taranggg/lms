import { Request, Response } from "express";
import MaterialModel from "../models/materials.js";

export const createMaterial = async (req: Request, res: Response) => {
  try {
    const material = await MaterialModel.create(req.body);
    res.status(201).json(material);
  } catch (error) {
    console.error("Error creating material:", error);
    res.status(500).json({ error: "Failed to create material" });
  }
};

export const getAllMaterials = async (req: Request, res: Response) => {
  try {
    const { type, page = 1, limit = 10 } = req.query;

    const query: any = {};
    if (type) query.type = type;

    const pageNumber = parseInt(page as string);
    const limitNumber = parseInt(limit as string);
    const skip = (pageNumber - 1) * limitNumber;

    const materials = await MaterialModel.find(query)
      .skip(skip)
      .limit(limitNumber);

    const total = await MaterialModel.countDocuments(query);

    res.status(200).json({
      data: materials,
      total,
      page: pageNumber,
      totalPages: Math.ceil(total / limitNumber),
    });
  } catch (error) {
    console.error("Error getting materials:", error);
    res.status(500).json({ error: "Failed to get materials" });
  }
};

export const getMaterialById = async (req: Request, res: Response) => {
  try {
    const material = await MaterialModel.findById(req.params.id);
    if (!material) {
      return res.status(404).json({ error: "Material not found" });
    }
    res.status(200).json(material);
  } catch (error) {
    console.error("Error getting material:", error);
    res.status(500).json({ error: "Failed to get material" });
  }
};

export const updateMaterial = async (req: Request, res: Response) => {
  try {
    const material = await MaterialModel.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!material) {
      return res.status(404).json({ error: "Material not found" });
    }
    res.status(200).json(material);
  } catch (error) {
    console.error("Error updating material:", error);
    res.status(500).json({ error: "Failed to update material" });
  }
};

export const deleteMaterial = async (req: Request, res: Response) => {
  try {
    const material = await MaterialModel.findByIdAndDelete(req.params.id);
    if (!material) {
      return res.status(404).json({ error: "Material not found" });
    }
    res.status(200).json(material);
  } catch (error) {
    console.error("Error deleting material:", error);
    res.status(500).json({ error: "Failed to delete material" });
  }
};
