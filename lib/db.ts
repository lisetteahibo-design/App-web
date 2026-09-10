import { DatabaseSync } from "node:sqlite";
import path from "node:path";
import fs from "node:fs";
import { randomUUID } from "node:crypto";

const DATA_DIR = path.join(process.cwd(), "data");
const DB_PATH = path.join(DATA_DIR, "trs.db");

declare global {
  // eslint-disable-next-line no-var
  var __trsDb: DatabaseSync | undefined;
}

function createDb(): DatabaseSync {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  const db = new DatabaseSync(DB_PATH);
  db.exec("PRAGMA journal_mode = WAL;");
  db.exec("PRAGMA foreign_keys = ON;");

  db.exec(`
    CREATE TABLE IF NOT EXISTS transactions (
      id TEXT PRIMARY KEY,
      name TEXT NOT NULL,
      type TEXT NOT NULL,
      reference TEXT,
      statut TEXT NOT NULL DEFAULT 'En préparation',
      description TEXT,
      date_signature TEXT,
      date_entree_vigueur TEXT,
      date_expiration TEXT,
      devise TEXT NOT NULL DEFAULT 'XOF',
      valeur_portefeuille REAL,
      prix_acquisition REAL,
      decote_pct REAL,
      encours_actuel REAL,
      nombre_debiteurs INTEGER,
      collateral_cible_pct REAL,
      collateral_actuel_pct REAL,
      frequence_echeance TEXT,
      jours_anticipation_lettre INTEGER,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS acteurs (
      id TEXT PRIMARY KEY,
      transaction_id TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
      role TEXT NOT NULL,
      nom TEXT NOT NULL,
      contact_nom TEXT,
      contact_email TEXT,
      contact_telephone TEXT,
      notes TEXT,
      created_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS etapes (
      id TEXT PRIMARY KEY,
      transaction_id TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
      pilier TEXT NOT NULL,
      titre TEXT NOT NULL,
      description TEXT,
      responsable TEXT,
      statut TEXT NOT NULL DEFAULT 'À faire',
      date_prevue TEXT,
      date_realisation TEXT,
      ordre INTEGER NOT NULL DEFAULT 0,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS echeances (
      id TEXT PRIMARY KEY,
      transaction_id TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
      type TEXT NOT NULL,
      date_echeance TEXT NOT NULL,
      montant REAL,
      devise TEXT NOT NULL DEFAULT 'XOF',
      statut TEXT NOT NULL DEFAULT 'À venir',
      responsable TEXT,
      date_realisation TEXT,
      notes TEXT,
      created_at TEXT NOT NULL,
      updated_at TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS documents (
      id TEXT PRIMARY KEY,
      transaction_id TEXT NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
      echeance_id TEXT REFERENCES echeances(id) ON DELETE SET NULL,
      type TEXT NOT NULL,
      nom TEXT NOT NULL,
      date_document TEXT,
      statut TEXT NOT NULL DEFAULT 'Brouillon',
      reference TEXT,
      notes TEXT,
      created_at TEXT NOT NULL
    );

    CREATE INDEX IF NOT EXISTS idx_acteurs_tx ON acteurs(transaction_id);
    CREATE INDEX IF NOT EXISTS idx_etapes_tx ON etapes(transaction_id);
    CREATE INDEX IF NOT EXISTS idx_echeances_tx ON echeances(transaction_id);
    CREATE INDEX IF NOT EXISTS idx_documents_tx ON documents(transaction_id);
  `);

  return db;
}

export function getDb(): DatabaseSync {
  if (!global.__trsDb) {
    global.__trsDb = createDb();
  }
  return global.__trsDb;
}

export function newId(): string {
  return randomUUID();
}

export function nowIso(): string {
  return new Date().toISOString();
}
