import { Router } from 'express';
import { getCategorias, getCategoriaById, createCategoria, updateCategoriaById, deleteCategoryById } from '../controllers/category';
import { verificaToken, verificaAdmin_Role } from '../middlewares/authentication';

export const category__router: Router = Router();
category__router.get('/categorys', verificaToken ,getCategorias);
category__router.get('/category/:id', verificaToken, getCategoriaById);
category__router.post('/category', verificaToken ,createCategoria);
category__router.put('/category/:id', verificaToken, updateCategoriaById );
category__router.delete('/category/:id', verificaToken, verificaAdmin_Role, deleteCategoryById);