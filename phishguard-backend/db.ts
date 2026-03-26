import Database from 'better-sqlite3';
import path from 'path';

let db: Database.Database | null = null;

// Use /tmp on Render (ephemeral fs), fall back to local for dev
const DB_PATH = process.env.NODE_ENV === 'production'
  ? '/tmp/phishguard.sqlite'
  : path.join(process.cwd(), 'phishguard.sqlite');

export async function initDb() {
  if (db) return db;

  db = new Database(DB_PATH);

  db.exec(`
    CREATE TABLE IF NOT EXISTS detections (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      target TEXT NOT NULL,
      confidence INTEGER NOT NULL,
      status TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS remediations (
      id TEXT PRIMARY KEY,
      detection_id TEXT NOT NULL,
      target TEXT NOT NULL,
      action TEXT NOT NULL,
      status TEXT NOT NULL,
      duration TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY(detection_id) REFERENCES detections(id)
    );

    CREATE TABLE IF NOT EXISTS audit_logs (
      id TEXT PRIMARY KEY,
      action TEXT NOT NULL,
      target TEXT NOT NULL,
      user TEXT NOT NULL,
      reason TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS correlations (
      id TEXT PRIMARY KEY,
      score INTEGER NOT NULL,
      status TEXT NOT NULL,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS siem_configs (
      id TEXT PRIMARY KEY,
      type TEXT NOT NULL,
      endpoint TEXT NOT NULL,
      token TEXT NOT NULL,
      enabled BOOLEAN NOT NULL DEFAULT 1,
      timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
    );
  `);

  console.log(`Database initialized at: ${DB_PATH}`);
  return db;
}

export async function getDb() {
  if (!db) {
    return await initDb();
  }
  return db;
}
