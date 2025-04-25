# 🚀 Viganium – Simple Assessment API

Viganium is a lightweight REST API built with **TypeScript**, **Express**, and **MySQL**. It provides basic CRUD operations for managing products and categories — perfect for learning, assessments, and small projects.

---

## ⚙️ Features

- Create, Read, and Delete operations for both products and categories  
- Pagination support using `offset` and `limit`  
- Filter products by one or multiple category names  
- Structured with modular controllers, routes, and services  
- Clean TypeScript-based codebase  
- Centralized error handling  

---

## 🔧 Getting Started

### 1. Clone the repository

git clone https://github.com/mostafasobh/viganium.git
cd viganium

### 2. Install dependencies

``` npm install ```
### 3. Setup your .env file

Create a .env file in the root directory:
```
DATABASE_HOST=localhost
DATABASE_USERNAME=root
DATABASE_PASSWORD=yourpassword
DATABASE_NAME=viganium_db
DATABASE_PORT=3306
PORT=3000
```
#### 💡 Don't want to set up a local MySQL server?

Use https://www.freesqldatabase.com to get a free online MySQL database. Replace the values above with the credentials provided there.

#### 🧪 Seed the Database
**<span style="color:red">You must seed the database before using the API!!!!!.</span>**

Hit this endpoint once:

```
GET /seed
```

#### This will create the products, categories, and necessary linking tables in your database.

### 🚀 Start the Server
For development (auto-reload)
```
npm start
```
For running compiled code
```
npm run build
npm run dev
```
## 📚 API Endpoints
### 📂 Categories

| Method | Endpoint              | Description                          |
|--------|-----------------------|--------------------------------------|
| GET    | `/api/categories`     | List categories (supports pagination)|
| GET    | `/api/categories/:id` | Get category by ID                   |
| POST   | `/api/categories`     | Create a new category                |
| DELETE | `/api/categories/:id` | Delete a category                    |

### 📦 Products

| Method | Endpoint              | Description                                      |
|--------|-----------------------|--------------------------------------------------|
| GET    | `/api/products`       | List products (with pagination and filtering by categories) |
| GET    | `/api/products/:id`   | Get product by ID                                |
| POST   | `/api/products`       | Create a new product                             |
| DELETE | `/api/products/:id`   | Delete a product                                 |

### 🧼 Code Quality Tools

- **[Prettier](https://prettier.io/)
- **[ESLint](https://eslint.org/)
- **[TypeScript](https://www.typescriptlang.org/)

### 🧠 Scripts

#### Command Description
- npm start	Start server with hot-reload
- npm run dev	Run compiled JavaScript (index.js)
- npm run build	Compile TypeScript to JavaScript