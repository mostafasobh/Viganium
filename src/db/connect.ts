import { createPool } from 'mysql2/promise';
import config from '../config/config';
import { RowDataPacket, ResultSetHeader } from 'mysql2';

export const connection = createPool({
  host: config.database_host,
  port: config.database_port,
  user: config.database_username,
  password: config.database_password,
  database: config.database_name,
});

export type QueryResultType = RowDataPacket[] | ResultSetHeader;

export const execute = async <T extends QueryResultType>(
  query: string,
  params: any[] | object = []
): Promise<T> => {
  try {
    if (!connection) throw new Error('Connection was not created. Ensure connection is instantiated.');

    const [results] = await connection.query<T>(query, params);
    return results;
  } catch (error) {
    console.error('Error executing query', error);
    throw error;
  }
};
