import { Router } from 'express';
import { requireAuth } from '../middleware/auth';
import { getDashboardStats, getSettings, updateSettings } from '../controllers/admin.controller';
import {
  adminGetReviews,
  adminUpdateReview,
  adminDeleteReview,
} from '../controllers/reviews.controller';
import { uploadImage, removeImage } from '../controllers/upload.controller';
import { uploadMiddleware } from '../middleware/upload';
import { Subscriber } from '../models/Subscriber.model';

const router = Router();

// All admin routes require auth
router.use(requireAuth);

router.get('/dashboard', getDashboardStats);
router.get('/settings', getSettings);
router.patch('/settings', updateSettings);
router.put('/settings', updateSettings);

// Image uploads
router.post('/upload', uploadMiddleware.single('file'), uploadImage);
router.delete('/upload', removeImage);

router.get('/reviews', adminGetReviews);
router.patch('/reviews/:id', adminUpdateReview);
router.delete('/reviews/:id', adminDeleteReview);

// Subscribers list
router.get('/subscribers', async (_req, res, next) => {
  try {
    const subscribers = await Subscriber.find().sort({ createdAt: -1 }).lean();
    res.json({ success: true, data: subscribers, total: subscribers.length });
  } catch (e) { next(e); }
});

export default router;
