import db from './db';

try {
  const notes = db.prepare('SELECT n.*, u.name as userName FROM notes n JOIN users u ON n.uploaded_by = u.id').all();
  console.log(`Total Notes: ${notes.length}`);
  notes.forEach((n: any) => {
    console.log(`- [${n.id}] ${n.title} (${n.subject}) by ${n.userName}`);
    console.log(`  URL: ${n.file_url}`);
  });

  const users = db.prepare('SELECT * FROM users').all();
  console.log(`Total Users: ${users.length}`);
} catch (err) {
  console.error('Check failed:', (err as any).message);
}
