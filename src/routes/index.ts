import express from 'express';
import { user_router } from './users';
import { category__router } from './category';
import { product__router } from './producto';

export const Routes = express();
Routes.use('', user_router );
Routes.use('', category__router );
Routes.use('', product__router );


