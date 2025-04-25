import { Request, Response } from 'express';
import { Product } from '../models/product';
import { AppError } from '../errors/models.errors';
import { parseAndValidateCategories } from '../validators/category.validator';

const getAll = async (req: Request, res: Response) => {
  try {
    const offset = parseInt(req.query.offset as string) || 1;
    const limit = parseInt(req.query.limit as string) || 15;
    const categoriesRaw = req.query.categories;
    let categories: string[] = [];
    
    if (categoriesRaw) {
      if (typeof categoriesRaw === 'string') {
        categories = [categoriesRaw];
      } 
      
      else if (Array.isArray(categoriesRaw)) {
        categories = categoriesRaw.map(item => String(item));
      }
    }
    
    if (categories.length > 0 && !categories.every(item => typeof item === 'string')) {
      res.status(400).send({
        message: 'Categories must be an array of strings'
      });
      return;
    }

    const products = await Product.findAll({ offset: offset - 1, limit, categories });
    res.status(200).send({
      message: 'OK',
      result: products
    });
  }
  catch (error) {
    res.status(500).send({
      message: 'INTERNAL SERVER ERROR',
      result: null
    });
  }
}


const findOne = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const categories = await Product.find(id);
    res.status(200).send({
      message: 'OK',
      result: categories
    });
  }
  catch (error) {
    res.status(500).send({
      message: 'INTERNAL SERVER ERROR',
      result: null
    });
  }
}

const deleteOne = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const categories = await Product.remove(id);
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
    console.log(error)
    res.status(500).send({
      message: 'INTERNAL SERVER ERROR',
      result: null
    });
  }
}

const addOne = async (req: Request, res: Response) => {
  try {
    const { name, price, discount_price, description, categories } = req.body;

    if (!name) {
      res.status(400).send({ message: 'Missing name field' });
      return
    }

    const parsedCategories: string[] | null = parseAndValidateCategories(categories, res);
    if (!parsedCategories) return;

    const result = await Product.addOne({ name, price, discount_price, description, categories: parsedCategories });

    res.status(201).send({
      message: 'Product created successfully',
      result,
    });
  } catch (err: any) {
    console.error(err);

    if (err.code === 'ER_DUP_ENTRY') {
      res.status(409).send({
        message: 'Product name already exists'
      });
      return
    }
    if (err instanceof AppError) {
      res.status(err.statusCode).send({
        message: err.message
      });
      return;
    }

    res.status(500).send({
      message: 'INTERNAL SERVER ERROR',
      result: null,
    });
  }
};



export default { getAll, findOne, deleteOne, addOne }