import { Router } from 'express';
import {
  placeOrder,
  getOrders,
  getOrderByNumber,
  updateOrderStatus,
  markOrderPaid,
} from '../controllers/orders.controller';
import { requireAuth } from '../middleware/auth';

const router = Router();

// Public
router.post('/', placeOrder);
router.get('/track/:orderNumber', getOrderByNumber);

// Admin only
router.get('/', requireAuth, getOrders);
router.patch('/:id/status', requireAuth, updateOrderStatus);
router.patch('/:id/payment', requireAuth, markOrderPaid);

export default router;
