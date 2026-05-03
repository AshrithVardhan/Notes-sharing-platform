import { Request, Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import db from '../db';
import path from 'path';
import fs from 'fs';

export const uploadNote = async (req: AuthRequest, res: Response) => {
  try {
    const { title, subject } = req.body;
    if (!req.file) {
      return res.status(400).json({ message: 'No file uploaded' });
    }

    const fileUrl = `/api/notes/download/${req.file.filename}`;
    
    const info = db.prepare('INSERT INTO notes (title, subject, file_url, uploaded_by) VALUES (?, ?, ?, ?)').run(
      title,
      subject,
      fileUrl,
      req.user?.id
    );

    const note = db.prepare(`
      SELECT n.*, u.name as userName, u.email as userEmail 
      FROM notes n 
      JOIN users u ON n.uploaded_by = u.id 
      WHERE n.id = ?
    `).get(info.lastInsertRowid) as any;

    const formattedNote = {
      ...note,
      _id: note.id.toString(),
      uploadedBy: { id: note.uploaded_by.toString(), name: note.userName, email: note.userEmail },
      likes: [],
      comments: []
    };
    res.status(201).json(formattedNote);
  } catch (error) {
    console.error('uploadNote Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const downloadNoteFile = async (req: Request, res: Response) => {
  try {
    const { fileId } = req.params;
    const filePath = path.join(process.cwd(), 'public', 'uploads', fileId);
    
    if (!fs.existsSync(filePath)) {
      return res.status(404).json({ message: 'File not found' });
    }

    res.sendFile(filePath);
  } catch (error) {
    console.error('downloadNoteFile Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getNotes = async (req: AuthRequest, res: Response) => {
  try {
    const { search } = req.query;
    let notes;
    if (search) {
      const queryStr = `%${search}%`;
      notes = db.prepare(`
        SELECT n.*, u.name as userName, u.email as userEmail 
        FROM notes n 
        JOIN users u ON n.uploaded_by = u.id 
        WHERE n.title LIKE ? OR n.subject LIKE ?
        ORDER BY n.created_at DESC
      `).all(queryStr, queryStr);
    } else {
      notes = db.prepare(`
        SELECT n.*, u.name as userName, u.email as userEmail 
        FROM notes n 
        JOIN users u ON n.uploaded_by = u.id 
        ORDER BY n.created_at DESC
      `).all();
    }

    // Transform notes to match expected format (uploadedBy as object)
    const formattedNotes = notes.map((n: any) => {
      const noteLikes = db.prepare('SELECT user_id FROM likes WHERE note_id = ?').all(n.id);
      const noteComments = db.prepare('SELECT id FROM comments WHERE note_id = ?').all(n.id);

      return {
        ...n,
        _id: n.id.toString(),
        uploadedBy: { id: n.uploaded_by.toString(), name: n.userName, email: n.userEmail },
        likes: noteLikes.map((l: any) => l.user_id.toString()),
        comments: noteComments
      };
    });

    res.json(formattedNotes);
  } catch (error) {
    console.error('getNotes Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getNoteById = async (req: AuthRequest, res: Response) => {
  try {
    const noteId = req.params.id;
    const note = db.prepare(`
      SELECT n.*, u.name as userName, u.email as userEmail 
      FROM notes n 
      JOIN users u ON n.uploaded_by = u.id 
      WHERE n.id = ?
    `).get(noteId) as any;

    if (!note) return res.status(404).json({ message: 'Note not found' });

    // Get likes
    const likes = db.prepare('SELECT user_id FROM likes WHERE note_id = ?').all(noteId);
    
    // Get comments
    const comments = db.prepare(`
      SELECT id, user_id as user, user_name as userName, text, created_at as createdAt 
      FROM comments WHERE note_id = ? ORDER BY created_at DESC
    `).all(noteId);

    const formattedNote = {
      ...note,
      _id: note.id.toString(),
      uploadedBy: { id: note.uploaded_by.toString(), name: note.userName, email: note.userEmail },
      likes: likes.map((l: any) => l.user_id.toString()),
      comments: comments.map((c: any) => ({ ...c, _id: c.id.toString(), user: { id: c.user.toString(), name: c.userName } }))
    };

    res.json(formattedNote);
  } catch (error) {
    console.error('getNoteById Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const likeNote = async (req: AuthRequest, res: Response) => {
  try {
    const noteId = req.params.id;
    const userId = req.user?.id;

    const existingLike = db.prepare('SELECT * FROM likes WHERE note_id = ? AND user_id = ?').get(noteId, userId);

    if (existingLike) {
      db.prepare('DELETE FROM likes WHERE note_id = ? AND user_id = ?').run(noteId, userId);
    } else {
      db.prepare('INSERT INTO likes (note_id, user_id) VALUES (?, ?)').run(noteId, userId);
    }

    const likes = db.prepare('SELECT user_id FROM likes WHERE note_id = ?').all(noteId);
    res.json({ id: noteId, likes: likes.map((l: any) => l.user_id.toString()) });
  } catch (error) {
    console.error('likeNote Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const { text } = req.body;
    const noteId = req.params.id;
    const userId = req.user?.id;

    const user = db.prepare('SELECT name FROM users WHERE id = ?').get(userId) as any;
    
    db.prepare('INSERT INTO comments (note_id, user_id, user_name, text) VALUES (?, ?, ?, ?)').run(
      noteId,
      userId,
      user.name,
      text
    );

    const comments = db.prepare(`
      SELECT id, user_id as user, user_name as userName, text, created_at as createdAt 
      FROM comments WHERE note_id = ? ORDER BY created_at DESC
    `).all(noteId);

    res.json({
      id: noteId,
      comments: comments.map((c: any) => ({ ...c, _id: c.id.toString(), user: { id: c.user.toString(), name: c.userName } }))
    });
  } catch (error) {
    console.error('addComment Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getLibraryStats = async (req: Request, res: Response) => {
  try {
    const totalNotes = db.prepare('SELECT COUNT(*) as count FROM notes').get() as any;
    const subjectCount = db.prepare('SELECT COUNT(DISTINCT subject) as count FROM notes').get() as any;
    const contributors = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
    
    res.json({
      totalNotes: totalNotes.count,
      subjectCount: subjectCount.count,
      contributors: contributors.count
    });
  } catch (error) {
    console.error('getLibraryStats Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
