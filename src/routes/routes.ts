import * as express from 'express';
const routes = express.Router();
import authRoutes from './authRoutes';
import gameRoutes from './gameRoutes';
import userRoutes from './userRoutes';

routes.use('/auth', authRoutes);
routes.use('/games', gameRoutes);
routes.use('/users', userRoutes);

export default routes;