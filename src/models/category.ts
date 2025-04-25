import { execute } from '../db/connect';
import { CategoryType } from './types';
import { ResultSetHeader, RowDataPacket } from 'mysql2';
import { AppError } from '../errors/models.errors';

export class Category {
  private static tableName: string = "categories";

  static async find(id: number): Promise<CategoryType | null> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const rows = await execute<RowDataPacket[]>(query, [id]);
  
    if (rows.length === 0) {
      throw new AppError(`Category with id ${id} not found`, 404);
    }
  
    return rows[0] as CategoryType;
  }

  static async findAll({ offset, limit }: { offset?: number; limit?: number } = {}): Promise<CategoryType[]> {
    const query = `SELECT * FROM ${this.tableName} LIMIT ? OFFSET ?;`;
    const rows = await execute<RowDataPacket[]>(query, [limit, offset]);

    return rows as CategoryType[];
  }

  static async remove(id: number): Promise<{ deleted: RowDataPacket | null }> {
    const query = `SELECT * FROM ${this.tableName} WHERE id = ?`;
    const [record] = await execute<RowDataPacket[]>(query, [id]);
  
    if (!record) {
      throw new AppError(`Category with id ${id} not found`, 404);
    }
  
    const deleteQuery = `DELETE FROM ${this.tableName} WHERE id = ?`;
    await execute<ResultSetHeader>(deleteQuery, [id]);
  
    return { deleted: record };
  }
  

  static async addOne(category: Omit<CategoryType, 'id'>): Promise<CategoryType> {
    const { name, description } = category;
    const result = await execute<ResultSetHeader>(
      `INSERT INTO ${this.tableName} (name, description) VALUES (?, ?) RETURNING *`,
      [name, description || null]
    );

    return await this.find(result.insertId) as CategoryType;
  }
}