import { Request, Response, NextFunction } from 'express';
import * as categoryService from '../services/category.service';

export async function list(_req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await categoryService.getCategories();
    res.json({ success: true, data: categories });
  } catch (error) {
    next(error);
  }
}

export async function getBySlug(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await categoryService.getCategoryBySlug(req.params.slug as string);
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

export async function update(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await categoryService.updateCategory(req.params.id as string, req.body);
    res.json({ success: true, data: category });
  } catch (error) {
    next(error);
  }
}

export async function remove(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await categoryService.deleteCategory(req.params.id as string);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}
