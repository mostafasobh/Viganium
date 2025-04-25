import { Request, Response } from 'express';
import { Category } from '../models/category';
import { AppError } from '../errors/models.errors';

const getAll = async (req: Request, res: Response) => {
  try {
    const offset = parseInt(req.query.offset as string) || 1;
    const limit = parseInt(req.query.limit as string) || 15;

    const categories = await Category.findAll({ offset : offset - 1, limit });

    res.status(200).send({
      message: 'OK',
      result: categories
    });
  } catch (error) {
    res.status(500).send({
      message: 'INTERNAL SERVER ERROR',
      result: null
    });
  }
}



const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const categories = await Category.find(id);
    res.status(200).send({
      message: 'OK',
      result: categories
    });
  }
  catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).send({
        message: error.message
      });
      return;
    }
    res.status(500).send({
      message: 'INTERNAL SERVER ERROR',
      result: null
    });
  }
}

const deleteOne = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const categories = await Category.remove(id);
    res.status(200).send({
      message: 'OK',
      result: categories
    });
  }
  catch (error) {
    if (error instanceof AppError) {
      res.status(error.statusCode).send({
        message: error.message
      });
      return;
    }
    res.status(500).send({
      message: 'INTERNAL SERVER ERROR',
      result: null
    });
  }
}

const addOne = async (req: Request, res: Response) => {
  try {
    const { name, description } = req.body;

    if (typeof name !== 'string' || name.trim() === '') {
      res.status(400).send({ message: 'A valid category name is required' });
      return;
    }

    const result = await Category.addOne({ name: name.trim(), description: description.trim() });

    res.status(201).send({
      message: 'Category created successfully',
      result,
    });

  } catch (error: any) {
    if (error.code === 'ER_DUP_ENTRY') {
      res.status(409).send({
        message: 'Category name already exists',
        result: null,
      });
      return;
    }

    console.error(error);
    res.status(500).send({
      message: 'INTERNAL SERVER ERROR',
      result: null,
    });
  }
};



export default { getAll, findOne, deleteOne, addOne }