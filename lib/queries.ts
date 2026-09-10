import { getDb, newId, nowIso } from "./db";
import type {
  Acteur,
  DocumentRecord,
  Echeance,
  Etape,
  Transaction,
} from "./types";
import { isOverdue } from "./dates";

function row<T>(stmt: ReturnType<ReturnType<typeof getDb>["prepare"]>, ...params: unknown[]): T | undefined {
  return stmt.get(...(params as never[])) as T | undefined;
}

// ---------- Transactions ----------

export interface TransactionFilters {
  type?: string;
  statut?: string;
  q?: string;
}

export function listTransactions(filters: TransactionFilters = {}): Transaction[] {
  const db = getDb();
  const clauses: string[] = [];
  const params: unknown[] = [];

  if (filters.type) {
    clauses.push("type = ?");
    params.push(filters.type);
  }
  if (filters.statut) {
    clauses.push("statut = ?");
    params.push(filters.statut);
  }
  if (filters.q) {
    clauses.push("(name LIKE ? OR reference LIKE ?)");
    params.push(`%${filters.q}%`, `%${filters.q}%`);
  }

  const where = clauses.length ? `WHERE ${clauses.join(" AND ")}` : "";
  const stmt = db.prepare(
    `SELECT * FROM transactions ${where} ORDER BY updated_at DESC`
  );
  return stmt.all(...(params as never[])) as unknown as Transaction[];
}

export function getTransaction(id: string): Transaction | undefined {
  const db = getDb();
  return row<Transaction>(db.prepare("SELECT * FROM transactions WHERE id = ?"), id);
}

export interface TransactionInput {
  name: string;
  type: string;
  reference?: string | null;
  statut: string;
  description?: string | null;
  date_signature?: string | null;
  date_entree_vigueur?: string | null;
  date_expiration?: string | null;
  devise?: string;
  valeur_portefeuille?: number | null;
  prix_acquisition?: number | null;
  decote_pct?: number | null;
  encours_actuel?: number | null;
  nombre_debiteurs?: number | null;
  collateral_cible_pct?: number | null;
  collateral_actuel_pct?: number | null;
  frequence_echeance?: string | null;
  jours_anticipation_lettre?: number | null;
  notes?: string | null;
}

export function createTransaction(input: TransactionInput): Transaction {
  const db = getDb();
  const id = newId();
  const now = nowIso();
  db.prepare(
    `INSERT INTO transactions (
      id, name, type, reference, statut, description,
      date_signature, date_entree_vigueur, date_expiration, devise,
      valeur_portefeuille, prix_acquisition, decote_pct, encours_actuel,
      nombre_debiteurs, collateral_cible_pct, collateral_actuel_pct,
      frequence_echeance, jours_anticipation_lettre, notes, created_at, updated_at
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    input.name,
    input.type,
    input.reference ?? null,
    input.statut,
    input.description ?? null,
    input.date_signature ?? null,
    input.date_entree_vigueur ?? null,
    input.date_expiration ?? null,
    input.devise ?? "XOF",
    input.valeur_portefeuille ?? null,
    input.prix_acquisition ?? null,
    input.decote_pct ?? null,
    input.encours_actuel ?? null,
    input.nombre_debiteurs ?? null,
    input.collateral_cible_pct ?? null,
    input.collateral_actuel_pct ?? null,
    input.frequence_echeance ?? null,
    input.jours_anticipation_lettre ?? null,
    input.notes ?? null,
    now,
    now
  );
  return getTransaction(id)!;
}

export function updateTransaction(id: string, input: TransactionInput): Transaction {
  const db = getDb();
  const now = nowIso();
  db.prepare(
    `UPDATE transactions SET
      name = ?, type = ?, reference = ?, statut = ?, description = ?,
      date_signature = ?, date_entree_vigueur = ?, date_expiration = ?, devise = ?,
      valeur_portefeuille = ?, prix_acquisition = ?, decote_pct = ?, encours_actuel = ?,
      nombre_debiteurs = ?, collateral_cible_pct = ?, collateral_actuel_pct = ?,
      frequence_echeance = ?, jours_anticipation_lettre = ?, notes = ?, updated_at = ?
    WHERE id = ?`
  ).run(
    input.name,
    input.type,
    input.reference ?? null,
    input.statut,
    input.description ?? null,
    input.date_signature ?? null,
    input.date_entree_vigueur ?? null,
    input.date_expiration ?? null,
    input.devise ?? "XOF",
    input.valeur_portefeuille ?? null,
    input.prix_acquisition ?? null,
    input.decote_pct ?? null,
    input.encours_actuel ?? null,
    input.nombre_debiteurs ?? null,
    input.collateral_cible_pct ?? null,
    input.collateral_actuel_pct ?? null,
    input.frequence_echeance ?? null,
    input.jours_anticipation_lettre ?? null,
    input.notes ?? null,
    now,
    id
  );
  return getTransaction(id)!;
}

export function deleteTransaction(id: string): void {
  const db = getDb();
  db.prepare("DELETE FROM transactions WHERE id = ?").run(id);
}

export function touchTransaction(id: string): void {
  const db = getDb();
  db.prepare("UPDATE transactions SET updated_at = ? WHERE id = ?").run(nowIso(), id);
}

// ---------- Acteurs ----------

export function listActeurs(transactionId: string): Acteur[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM acteurs WHERE transaction_id = ? ORDER BY created_at ASC")
    .all(transactionId) as unknown as Acteur[];
}

export interface ActeurInput {
  role: string;
  nom: string;
  contact_nom?: string | null;
  contact_email?: string | null;
  contact_telephone?: string | null;
  notes?: string | null;
}

export function createActeur(transactionId: string, input: ActeurInput): Acteur {
  const db = getDb();
  const id = newId();
  db.prepare(
    `INSERT INTO acteurs (id, transaction_id, role, nom, contact_nom, contact_email, contact_telephone, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    transactionId,
    input.role,
    input.nom,
    input.contact_nom ?? null,
    input.contact_email ?? null,
    input.contact_telephone ?? null,
    input.notes ?? null,
    nowIso()
  );
  touchTransaction(transactionId);
  return db.prepare("SELECT * FROM acteurs WHERE id = ?").get(id) as unknown as Acteur;
}

export function deleteActeur(id: string, transactionId: string): void {
  const db = getDb();
  db.prepare("DELETE FROM acteurs WHERE id = ?").run(id);
  touchTransaction(transactionId);
}

// ---------- Etapes ----------

export function listEtapes(transactionId: string): Etape[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM etapes WHERE transaction_id = ? ORDER BY ordre ASC, created_at ASC")
    .all(transactionId) as unknown as Etape[];
}

export interface EtapeInput {
  pilier: string;
  titre: string;
  description?: string | null;
  responsable?: string | null;
  statut: string;
  date_prevue?: string | null;
  date_realisation?: string | null;
  ordre?: number;
}

export function createEtape(transactionId: string, input: EtapeInput): Etape {
  const db = getDb();
  const id = newId();
  const now = nowIso();
  db.prepare(
    `INSERT INTO etapes (id, transaction_id, pilier, titre, description, responsable, statut, date_prevue, date_realisation, ordre, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    transactionId,
    input.pilier,
    input.titre,
    input.description ?? null,
    input.responsable ?? null,
    input.statut,
    input.date_prevue ?? null,
    input.date_realisation ?? null,
    input.ordre ?? 0,
    now,
    now
  );
  touchTransaction(transactionId);
  return db.prepare("SELECT * FROM etapes WHERE id = ?").get(id) as unknown as Etape;
}

export function updateEtape(id: string, transactionId: string, input: Partial<EtapeInput>): Etape {
  const db = getDb();
  const current = db.prepare("SELECT * FROM etapes WHERE id = ?").get(id) as unknown as Etape;
  const merged = { ...current, ...input };
  db.prepare(
    `UPDATE etapes SET pilier = ?, titre = ?, description = ?, responsable = ?, statut = ?, date_prevue = ?, date_realisation = ?, ordre = ?, updated_at = ?
     WHERE id = ?`
  ).run(
    merged.pilier,
    merged.titre,
    merged.description ?? null,
    merged.responsable ?? null,
    merged.statut,
    merged.date_prevue ?? null,
    merged.date_realisation ?? null,
    merged.ordre ?? 0,
    nowIso(),
    id
  );
  touchTransaction(transactionId);
  return db.prepare("SELECT * FROM etapes WHERE id = ?").get(id) as unknown as Etape;
}

export function deleteEtape(id: string, transactionId: string): void {
  const db = getDb();
  db.prepare("DELETE FROM etapes WHERE id = ?").run(id);
  touchTransaction(transactionId);
}

// ---------- Echeances ----------

export function listEcheances(transactionId: string): Echeance[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM echeances WHERE transaction_id = ? ORDER BY date_echeance ASC")
    .all(transactionId) as unknown as Echeance[];
}

export interface EcheanceInput {
  type: string;
  date_echeance: string;
  montant?: number | null;
  devise?: string;
  statut: string;
  responsable?: string | null;
  date_realisation?: string | null;
  notes?: string | null;
}

export function createEcheance(transactionId: string, input: EcheanceInput): Echeance {
  const db = getDb();
  const id = newId();
  const now = nowIso();
  db.prepare(
    `INSERT INTO echeances (id, transaction_id, type, date_echeance, montant, devise, statut, responsable, date_realisation, notes, created_at, updated_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    transactionId,
    input.type,
    input.date_echeance,
    input.montant ?? null,
    input.devise ?? "XOF",
    input.statut,
    input.responsable ?? null,
    input.date_realisation ?? null,
    input.notes ?? null,
    now,
    now
  );
  touchTransaction(transactionId);
  return db.prepare("SELECT * FROM echeances WHERE id = ?").get(id) as unknown as Echeance;
}

export function updateEcheance(id: string, transactionId: string, input: Partial<EcheanceInput>): Echeance {
  const db = getDb();
  const current = db.prepare("SELECT * FROM echeances WHERE id = ?").get(id) as unknown as Echeance;
  const merged = { ...current, ...input };
  db.prepare(
    `UPDATE echeances SET type = ?, date_echeance = ?, montant = ?, devise = ?, statut = ?, responsable = ?, date_realisation = ?, notes = ?, updated_at = ?
     WHERE id = ?`
  ).run(
    merged.type,
    merged.date_echeance,
    merged.montant ?? null,
    merged.devise ?? "XOF",
    merged.statut,
    merged.responsable ?? null,
    merged.date_realisation ?? null,
    merged.notes ?? null,
    nowIso(),
    id
  );
  touchTransaction(transactionId);
  return db.prepare("SELECT * FROM echeances WHERE id = ?").get(id) as unknown as Echeance;
}

export function deleteEcheance(id: string, transactionId: string): void {
  const db = getDb();
  db.prepare("DELETE FROM echeances WHERE id = ?").run(id);
  touchTransaction(transactionId);
}

// ---------- Documents ----------

export function listDocuments(transactionId: string): DocumentRecord[] {
  const db = getDb();
  return db
    .prepare("SELECT * FROM documents WHERE transaction_id = ? ORDER BY created_at DESC")
    .all(transactionId) as unknown as DocumentRecord[];
}

export interface DocumentInput {
  type: string;
  nom: string;
  echeance_id?: string | null;
  date_document?: string | null;
  statut: string;
  reference?: string | null;
  notes?: string | null;
}

export function createDocument(transactionId: string, input: DocumentInput): DocumentRecord {
  const db = getDb();
  const id = newId();
  db.prepare(
    `INSERT INTO documents (id, transaction_id, echeance_id, type, nom, date_document, statut, reference, notes, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
  ).run(
    id,
    transactionId,
    input.echeance_id ?? null,
    input.type,
    input.nom,
    input.date_document ?? null,
    input.statut,
    input.reference ?? null,
    input.notes ?? null,
    nowIso()
  );
  touchTransaction(transactionId);
  return db.prepare("SELECT * FROM documents WHERE id = ?").get(id) as unknown as DocumentRecord;
}

export function deleteDocument(id: string, transactionId: string): void {
  const db = getDb();
  db.prepare("DELETE FROM documents WHERE id = ?").run(id);
  touchTransaction(transactionId);
}

// ---------- Aggregates / Dashboard ----------

export interface UpcomingEcheance extends Echeance {
  transaction_name: string;
  transaction_type: string;
}

export function getUpcomingEcheances(days = 30): UpcomingEcheance[] {
  const db = getDb();
  const all = db
    .prepare(
      `SELECT e.*, t.name as transaction_name, t.type as transaction_type
       FROM echeances e JOIN transactions t ON t.id = e.transaction_id
       WHERE e.statut NOT IN ('Réalisée', 'Annulée')
       ORDER BY e.date_echeance ASC`
    )
    .all() as unknown as UpcomingEcheance[];

  return all.filter((e) => {
    const diff = Math.round(
      (new Date(e.date_echeance).setHours(0, 0, 0, 0) - new Date().setHours(0, 0, 0, 0)) / 86400000
    );
    return diff <= days;
  });
}

export function getOverdueEcheances(): UpcomingEcheance[] {
  return getUpcomingEcheances(100000).filter((e) => isOverdue(e.date_echeance));
}

export interface DashboardStats {
  totalTransactions: number;
  enCours: number;
  clôturées: number;
  suspendues: number;
  totalEncours: number;
  byType: { type: string; count: number }[];
  upcoming: UpcomingEcheance[];
  overdue: UpcomingEcheance[];
  collateralAlerts: Transaction[];
}

export function getDashboardStats(): DashboardStats {
  const db = getDb();
  const transactions = db.prepare("SELECT * FROM transactions").all() as unknown as Transaction[];

  const byTypeMap = new Map<string, number>();
  for (const t of transactions) {
    byTypeMap.set(t.type, (byTypeMap.get(t.type) ?? 0) + 1);
  }

  const upcoming = getUpcomingEcheances(30);
  const overdue = getOverdueEcheances();

  const collateralAlerts = transactions.filter(
    (t) =>
      t.collateral_cible_pct != null &&
      t.collateral_actuel_pct != null &&
      t.collateral_actuel_pct < t.collateral_cible_pct
  );

  return {
    totalTransactions: transactions.length,
    enCours: transactions.filter((t) => t.statut === "En cours").length,
    clôturées: transactions.filter((t) => t.statut === "Clôturée").length,
    suspendues: transactions.filter((t) => t.statut === "Suspendue").length,
    totalEncours: transactions.reduce((sum, t) => sum + (t.encours_actuel ?? 0), 0),
    byType: Array.from(byTypeMap.entries()).map(([type, count]) => ({ type, count })),
    upcoming,
    overdue,
    collateralAlerts,
  };
}
