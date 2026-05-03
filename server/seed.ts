import db, { initDb } from './db';
import axios from 'axios';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SEED_USER = {
  name: 'Academic Archivist',
  email: 'archivist@noteshare.edu',
  password: 'securepassword123'
};

const NOTES_DATA = [
  {
    title: 'Linear Algebra - Comprehensive Notes',
    subject: 'Mathematics',
    fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf'
  },
  {
    title: 'Computer Science - Principles of Computing',
    subject: 'Computer Science',
    fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf'
  },
  {
    title: 'Quantum Mechanics - Advanced Physics',
    subject: 'Physics',
    fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf'
  },
  {
    title: 'World History - Renaissance Period',
    subject: 'History',
    fileUrl: 'https://raw.githubusercontent.com/mozilla/pdf.js/master/web/compressed.tracemonkey-pldi-09.pdf'
  }
];

async function downloadFile(url: string, fileName: string) {
  const uploadDir = path.join(process.cwd(), 'public', 'uploads');
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  const filePath = path.join(uploadDir, fileName);
  
  if (fs.existsSync(filePath)) return fileName;

  console.log(`Downloading ${url}...`);
  const response = await axios({
    url,
    method: 'GET',
    responseType: 'stream'
  });

  const writer = fs.createWriteStream(filePath);
  response.data.pipe(writer);

  return new Promise<string>((resolve, reject) => {
    writer.on('finish', () => resolve(fileName));
    writer.on('error', reject);
  });
}

async function seed() {
  try {
    initDb();
    console.log('Connected to SQLite for seeding...');

    // Clear existing data
    db.prepare('DELETE FROM comments').run();
    db.prepare('DELETE FROM likes').run();
    db.prepare('DELETE FROM notes').run();
    db.prepare('DELETE FROM users').run();
    console.log('Cleared existing data.');

    // Create seeder user
    const info = db.prepare('INSERT INTO users (name, email, password) VALUES (?, ?, ?)').run(
      SEED_USER.name,
      SEED_USER.email,
      SEED_USER.password
    );
    const userId = info.lastInsertRowid;
    console.log('Created seeder user');

    for (const noteData of NOTES_DATA) {
      const safeName = noteData.title.replace(/[^a-z0-9]/gi, '_').toLowerCase() + '.pdf';
      try {
          await downloadFile(noteData.fileUrl, safeName);
          const localUrl = `/api/notes/download/${safeName}`;
          
          db.prepare('INSERT INTO notes (title, subject, file_url, uploaded_by) VALUES (?, ?, ?, ?)').run(
            noteData.title,
            noteData.subject,
            localUrl,
            userId
          );
          console.log(`Seeded: ${noteData.title}`);
      } catch (err) {
          console.error(`Failed to download/seed ${noteData.title}:`, (err as any).message);
      }
    }

    console.log('Seeding complete!');
    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
