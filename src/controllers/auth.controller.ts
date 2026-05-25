import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { AdminUser } from '../models/AdminUser.model';
import { AuthRequest } from '../middleware/auth';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

// POST /api/auth/login
export async function login(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { username, password } = loginSchema.parse(req.body);

    const admin = await AdminUser.findOne({ username: username.toLowerCase() });
    if (!admin || !(await admin.comparePassword(password))) {
      res.status(401).json({ success: false, error: 'Invalid username or password.' });
      return;
    }

    const token = jwt.sign(
      { id: admin._id.toString(), username: admin.username },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      data: { token, admin: { username: admin.username } },
    });
  } catch (error) {
    next(error);
  }
}

// GET /api/auth/me
export async function getMe(
  req: AuthRequest,
  res: Response
): Promise<void> {
  res.json({
    success: true,
    data: { username: req.admin?.username },
  });
}
