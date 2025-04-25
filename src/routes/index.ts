import { Router } from 'express';
import productRouter from './product.route';
import catigoryRouter from './category.route';
const routes = Router();

routes.use('/products', productRouter);
routes.use('/categories', catigoryRouter);

export default routes;