import { Router } from 'express';
import productController from '../controllers/products.controller';
const productRouter = Router();

productRouter.get('/', productController.getAll);
productRouter.get('/:id', productController.findOne);
productRouter.delete('/:id', productController.deleteOne);
productRouter.post('/', productController.addOne);
export default productRouter;