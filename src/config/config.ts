import dotenv from 'dotenv';

dotenv.config();

interface Config {
  port: number;
  database_username: string;
  database_password: string;
  database_host: string;
  database_name: string;
  database_port?: number;
}

if (!process.env.DATABASE_HOST || !process.env.DATABASE_USERNAME || !process.env.DATABASE_NAME || !process.env.DATABASE_PASSWORD) {
  throw new Error('Missing required environment variables');
} else {
  var config: Config = {
    port: Number(process.env.PORT) || 3000,
    database_host: process.env.DATABASE_HOST,
    database_username: process.env.DATABASE_USERNAME,
    database_name: process.env.DATABASE_NAME,
    database_password: process.env.DATABASE_PASSWORD,
    database_port: Number(process.env.DATABASE_PORT) || 3306
  };

}

export default config ;