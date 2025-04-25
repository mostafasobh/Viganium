import { Router } from 'express';
import categoryController from '../controllers/catigroies.controller';
const catigoryRouter = Router();

catigoryRouter.get('/', categoryController.getAll);
catigoryRouter.get('/:id', categoryController.findOne);
catigoryRouter.delete('/:id', categoryController.deleteOne);
catigoryRouter.post('/', categoryController.addOne);
export default catigoryRouter;