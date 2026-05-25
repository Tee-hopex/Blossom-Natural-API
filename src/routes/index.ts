import { Router, Request, Response, NextFunction } from 'express';
import productRoutes from './products.routes';
import categoryRoutes from './categories.routes';
import orderRoutes from './orders.routes';
import authRoutes from './auth.routes';
import adminRoutes from './admin.routes';
import reviewRoutes from './reviews.routes';
import { getSettings } from '../controllers/admin.controller';

export const apiRouter = Router();

apiRouter.use('/auth', authRoutes);
apiRouter.use('/admin', adminRoutes);
apiRouter.use('/products', productRoutes);
apiRouter.use('/categories', categoryRoutes);
apiRouter.use('/orders', orderRoutes);
apiRouter.use('/reviews', reviewRoutes);

// Public settings endpoint — checkout page reads bank details from here
apiRouter.get('/settings', (req: Request, res: Response, next: NextFunction) =>
  getSettings(req as never, res, next)
);
