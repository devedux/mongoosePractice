import { Router } from 'express';
import { verificaToken } from '../middlewares/authentication';
import { getProductos, getProductoById, createProducto, updateProductoById, deleteProductoById, searchProducto } from '../controllers/producto';

export const product__router = Router();
product__router.get('/products', verificaToken, getProductos);
product__router.get('/product/:id', verificaToken, getProductoById);
product__router.post('/product', verificaToken, createProducto);
product__router.put('/product/:id', verificaToken, updateProductoById);
product__router.delete('/product/:id', verificaToken, deleteProductoById);
product__router.get('/product/search/:termino', verificaToken, searchProducto);