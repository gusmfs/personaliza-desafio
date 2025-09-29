import sqlite3 from 'sqlite3'
import path from 'path'

const DB_PATH = path.join(process.cwd(), 'database.sqlite')

const db = new sqlite3.Database(DB_PATH, (err) => {
  if (err) {
    console.error('Erro ao conectar com SQLite:', err.message)
  } else {
    console.log('Conectado ao SQLite')
  }
})

export function runQuery(sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
      if (err) {
        reject(err)
      } else {
        resolve({ id: this.lastID, changes: this.changes })
      }
    })
  })
}

export function getQuery(sql: string, params: any[] = []): Promise<any> {
  return new Promise((resolve, reject) => {
    db.get(sql, params, (err, row) => {
      if (err) {
        reject(err)
      } else {
        resolve(row)
      }
    })
  })
}

export function allQuery(sql: string, params: any[] = []): Promise<any[]> {
  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        reject(err)
      } else {
        resolve(rows)
      }
    })
  })
}

export async function initializeDatabase() {
  try {
    await runQuery(`
      CREATE TABLE IF NOT EXISTS patients (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        dateOfBirth DATE,
        phone TEXT,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `)

    await runQuery(`
      CREATE TABLE IF NOT EXISTS attachments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        filename TEXT NOT NULL,
        originalName TEXT NOT NULL,
        mimeType TEXT NOT NULL,
        size INTEGER NOT NULL,
        path TEXT NOT NULL,
        patientId INTEGER NOT NULL,
        createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE
      )
    `)

    await runQuery(`CREATE INDEX IF NOT EXISTS idx_attachments_patient_id ON attachments(patientId)`)
    await runQuery(`CREATE INDEX IF NOT EXISTS idx_patients_name ON patients(name)`)

    console.log('Database initialized successfully!')
  } catch (error) {
    console.error('Error initializing database:', error)
    throw error
  }
}

export default db

