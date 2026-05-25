import { Response, NextFunction } from 'express';
import { AuthRequest } from '../middleware/auth';
import { uploadBuffer, deleteImage } from '../lib/cloudinary';

const ALLOWED_FOLDERS = ['products', 'categories', 'general'] as const;
type AllowedFolder = (typeof ALLOWED_FOLDERS)[number];

function sanitizeFolder(raw: unknown): AllowedFolder {
  if (typeof raw === 'string' && (ALLOWED_FOLDERS as readonly string[]).includes(raw)) {
    return raw as AllowedFolder;
  }
  return 'general';
}

export async function uploadImage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    if (!req.file) {
      res.status(400).json({ success: false, error: 'No file provided.' });
      return;
    }

    const folder = `blossom_natural/${sanitizeFolder(req.body.folder ?? req.query.folder)}`;
    const result = await uploadBuffer(req.file.buffer, folder);

    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function removeImage(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const { publicId } = req.body as { publicId?: string };
    if (!publicId || typeof publicId !== 'string') {
      res.status(400).json({ success: false, error: 'publicId is required.' });
      return;
    }

    await deleteImage(publicId);
    res.json({ success: true });
  } catch (err) {
    next(err);
  }
}
