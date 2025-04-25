import { connection } from './connect';

// This file is used to seed the database with initial tables
async function seedDatabase() {
  let conn;
  try {
    conn = await connection.getConnection();

    const createProductsTable = `
      CREATE TABLE IF NOT EXISTS products (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(20) UNIQUE, 
        price FLOAT,
        discount_price FLOAT,
        description TEXT
      );
    `;

    const createCategoriesTable = `
      CREATE TABLE IF NOT EXISTS categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(20) UNIQUE,
        description TEXT
      );
    `;

    const createProductCategoriesTable = `
      CREATE TABLE IF NOT EXISTS product_categories (
        id INT AUTO_INCREMENT PRIMARY KEY,
        category_id INT,
        product_id INT,
        FOREIGN KEY (product_id) REFERENCES products(id) ON DELETE CASCADE,
        FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE CASCADE
      );
    `;

    await conn.beginTransaction();

    try {
      await conn.query(createProductsTable);
      await conn.query(createCategoriesTable);
      await conn.query(createProductCategoriesTable);


      await conn.commit();
      console.log('Tables created successfully');
    } catch (err) {
      await conn.rollback();
      console.error('Transaction failed:', err);
    }
  } catch (err) {
    console.error('Connection error:', err);
  } finally {
    if (conn) {
      conn.release();
    }
  }
}

export default seedDatabase;
