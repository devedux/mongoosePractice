import { model } from 'mongoose';
import { usuarioSchema } from '../collections/users';
import { categorySchema } from '../collections/category';
import { productoSchema } from '../collections/producto';

export const Usuario = model('Usuario', usuarioSchema);
export const Categoria = model('Categoria', categorySchema);
export const Producto = model('Producto', productoSchema);