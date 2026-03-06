import express from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import { fileURLToPath } from 'url';
import db, { initDatabase } from './backend/database.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Initialize DB
initDatabase();

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // API Routes
  
  // Inquiries
  app.get('/api/inquiries', (req, res) => {
    try {
      const stmt = db.prepare('SELECT * FROM students_inquiries ORDER BY created_at DESC');
      const inquiries = stmt.all();
      res.json(inquiries);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch inquiries' });
    }
  });

  app.post('/api/inquiries', (req, res) => {
    const { nom, prenom, email, telephone, niveau, message } = req.body;
    try {
      const stmt = db.prepare('INSERT INTO students_inquiries (nom, prenom, email, telephone, niveau, message) VALUES (?, ?, ?, ?, ?, ?)');
      const info = stmt.run(nom, prenom, email, telephone, niveau, message);
      res.json({ id: info.lastInsertRowid, success: true });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to create inquiry' });
    }
  });

  // Fees
  app.get('/api/fees', (req, res) => {
    try {
      const stmt = db.prepare('SELECT * FROM school_fees');
      const fees = stmt.all();
      res.json(fees);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch fees' });
    }
  });

  // Announcements
  app.get('/api/announcements', (req, res) => {
    try {
      const stmt = db.prepare('SELECT * FROM announcements ORDER BY created_at DESC');
      const announcements = stmt.all();
      res.json(announcements);
    } catch (error) {
      res.status(500).json({ error: 'Failed to fetch announcements' });
    }
  });

  app.post('/api/announcements', (req, res) => {
    const { title, content } = req.body;
    try {
      const stmt = db.prepare('INSERT INTO announcements (title, content) VALUES (?, ?)');
      const info = stmt.run(title, content);
      res.json({ id: info.lastInsertRowid, success: true });
    } catch (error) {
      res.status(500).json({ error: 'Failed to create announcement' });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    // Serve static files in production
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
