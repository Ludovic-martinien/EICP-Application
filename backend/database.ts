import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = path.join(process.cwd(), 'database.sqlite');
const db = new Database(dbPath);

export function initDatabase() {
  // Enable foreign keys
  db.pragma('foreign_keys = ON');

  // Create tables based on the user request
  const schema = `
    CREATE TABLE IF NOT EXISTS students_inquiries (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nom TEXT NOT NULL,
      prenom TEXT NOT NULL,
      email TEXT NOT NULL,
      telephone TEXT,
      niveau TEXT,
      message TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS announcements (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      content TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS school_fees (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      level TEXT NOT NULL,
      price TEXT NOT NULL,
      description TEXT,
      category TEXT -- 'inscription', 'reinscription', 'scolarite'
    );

    -- Pre-populate fees if empty
    INSERT OR IGNORE INTO school_fees (id, level, price, description, category) VALUES 
    (1, 'Droits d''inscription', '500 000 FCFA', 'Frais unique', 'inscription'),
    (2, 'Réinscription', '250 000 FCFA', 'Frais annuel', 'reinscription'),
    (3, 'Toute petite / Moyenne section (Option 1)', '200 000 FCFA', '7h50 – 12h30', 'scolarite'),
    (4, 'Toute petite / Moyenne section (Option 2)', '280 000 FCFA', '7h50 – 15h00', 'scolarite'),
    (5, 'Grande section', '300 000 FCFA', '', 'scolarite'),
    (6, 'CP à CM2', '350 000 FCFA', '', 'scolarite'),
    (7, '6ème à 4ème', '450 000 FCFA', '', 'scolarite'),
    (8, '3ème à Terminale', '550 000 FCFA', 'Frais d’examen non inclus', 'scolarite');
  `;

  db.exec(schema);
  console.log('Database initialized');
}

export default db;
