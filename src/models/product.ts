import { connection, execute } from '../db/connect';
import { ProductType } from './types';
import { CategoryType } from './types';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { AppError } from '../errors/models.errors';

export class Product {
  private static tableName: string = "products";
  static find(id: number) {
    
    let conditions: {}[] = [];
    conditions.push(id);

    const query = `
      SELECT 
        p.*, 
        GROUP_CONCAT(c.name) AS categories
      FROM ${this.tableName} p
      LEFT JOIN product_categories pc ON p.id = pc.product_id
      LEFT JOIN categories c ON c.id = pc.category_id
      WHERE p.id = ?
      GROUP BY p.id
    `;

    return execute<ResultSetHeader>(query, conditions);
  }
  
  static async findAll({
    offset = 0,
    limit = 10,
    categories = [] as string[],
  }: { offset?: number; limit?: number; categories?: string[] } = {}): Promise<(ProductType & { categories: string[] })[]> {
    let query = `
      SELECT 
        p.id,
        p.name,
        p.price,
        p.discount_price,
        p.description,
        GROUP_CONCAT(c.name) AS categories
      FROM products p
      LEFT JOIN product_categories pc ON pc.product_id = p.id
      LEFT JOIN categories c ON c.id = pc.category_id
    `;
    
    const params: any[] = [];
  
    if (categories.length > 0) {
      query += ` WHERE c.name IN (?)`;
      params.push(categories);
    }
  
    query += `
      GROUP BY p.id
      LIMIT ? OFFSET ?;
    `;
    
    params.push(limit, offset);
  
    const rows = await execute<RowDataPacket[]>(query, params);
    
    return rows as (ProductType & { categories: string[] })[];
  }

  static async remove(id: number): Promise<{ deleted: RowDataPacket | null }> {
    const selectQuery = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const [record] = await execute<RowDataPacket[]>(selectQuery, [id]);

    if (!record) {
      throw new AppError(`Product with id ${id} not found`, 404);
    }
    const deleteQuery = `DELETE FROM ${this.tableName} WHERE id = ?`;
    await execute<ResultSetHeader>(deleteQuery, [id]);

    return { deleted: record };
  }

  static async addOne(
    product: Omit<ProductType, 'id'> & { categories: CategoryType['name'][] }
  ): Promise<ProductType> {
    const { name, price, discount_price, description, categories } = product;
    const tableName = this.tableName;
  
    const conn = await connection.getConnection();
    try {
      await conn.beginTransaction();
  
      const [result]: any = await conn.query(
        `INSERT INTO ${tableName} (name, price, discount_price, description) VALUES (?, ?, ?, ?)`,
        [name, price, discount_price, description || null]
      );
      const productId = result.insertId;
  
      const [rows]: any = await conn.query(
        `SELECT id FROM categories WHERE name IN (?)`,
        [categories]
      );
      const categoryIds = rows.map((row: any) => row.id);
      
      if (categoryIds.length === 0) {
        throw new AppError(`There should be at least one valid category name`, 404);
      }

      for (const categoryId of categoryIds) {
        await conn.query(
          `INSERT INTO product_categories (product_id, category_id) VALUES (?, ?)`,
          [productId, categoryId]
        );
      }
  
      await conn.commit();
  
      return { id: productId, ...product };
    } catch (error) {
      await conn.rollback();
      console.error('Rolling back adding product action', error);
      throw error;
    } finally {
      conn.release();
    }
  }
  
}