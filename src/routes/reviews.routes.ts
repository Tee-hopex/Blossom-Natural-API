import { Router } from 'express';
import { submitReview, getProductReviews } from '../controllers/reviews.controller';

const router = Router();

router.post('/:productId', submitReview);
router.get('/:productId', getProductReviews);

export default router;
