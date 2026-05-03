import express from 'express';
import { register, login } from './controllers/authController';
import { uploadNote, getNotes, getNoteById, likeNote, addComment, downloadNoteFile, getLibraryStats } from './controllers/noteController';
import { authMiddleware } from './middleware/authMiddleware';
import multer from 'multer';

const router = express.Router();

// Multer setup for disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/uploads');
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  }
});
const upload = multer({ storage });

// Auth Routes
router.post('/auth/register', register);
router.post('/auth/login', login);

// Note Routes
router.get('/notes', getNotes);
router.get('/notes/stats', getLibraryStats);
router.get('/notes/download/:fileId', downloadNoteFile);
router.get('/notes/:id', getNoteById);
router.post('/notes', authMiddleware, upload.single('file'), uploadNote);
router.post('/notes/:id/like', authMiddleware, likeNote);
router.post('/notes/:id/comment', authMiddleware, addComment);

export default router;
