export type TransactionStatut =
  | "En préparation"
  | "En cours"
  | "Suspendue"
  | "Clôturée";

export const TRANSACTION_STATUTS: TransactionStatut[] = [
  "En préparation",
  "En cours",
  "Suspendue",
  "Clôturée",
];

export const TRANSACTION_TYPES_SUGGERES = [
  "TRS (Total Return Swap)",
  "Cession de créances (NPL)",
  "Titrisation",
  "Affacturage",
  "Autre",
];

export const ACTEUR_ROLES = [
  "Arrangeur",
  "Banque Cédante",
  "SPV Acquéreur",
  "SPV Investisseur",
  "Cabinet de Conseils Juridiques",
  "Débiteur",
  "Autre",
];

export const PILIERS = [
  "Établissement de la convention",
  "Gestion et Reporting",
  "Recouvrement et Flux Financiers",
  "Suivi des Échéances",
  "Production et Évaluation des rapports",
] as const;

export type Pilier = (typeof PILIERS)[number];

export const ETAPE_STATUTS = ["À faire", "En cours", "Terminé", "Bloqué"] as const;
export type EtapeStatut = (typeof ETAPE_STATUTS)[number];

export const ECHEANCE_TYPES = [
  "Reversement semestriel",
  "Reporting trimestriel",
  "Lettre d'instruction",
  "Renouvellement cash collatéral",
  "Autre",
] as const;
export type EcheanceType = (typeof ECHEANCE_TYPES)[number];

export const ECHEANCE_STATUTS = [
  "À venir",
  "Lettre envoyée",
  "En cours",
  "Réalisée",
  "En retard",
  "Annulée",
] as const;
export type EcheanceStatut = (typeof ECHEANCE_STATUTS)[number];

export const DOCUMENT_TYPES = [
  "Lettre d'instruction",
  "Rapport de gestion",
  "Avis de débit",
  "Relevé de compte",
  "Acte de cession",
  "Convention de gestion",
  "Autre",
] as const;
export type DocumentType = (typeof DOCUMENT_TYPES)[number];

export const DOCUMENT_STATUTS = ["Brouillon", "Envoyé", "Reçu", "Archivé"] as const;
export type DocumentStatut = (typeof DOCUMENT_STATUTS)[number];

export interface Transaction {
  id: string;
  name: string;
  type: string;
  reference: string | null;
  statut: TransactionStatut;
  description: string | null;
  date_signature: string | null;
  date_entree_vigueur: string | null;
  date_expiration: string | null;
  devise: string;
  valeur_portefeuille: number | null;
  prix_acquisition: number | null;
  decote_pct: number | null;
  encours_actuel: number | null;
  nombre_debiteurs: number | null;
  collateral_cible_pct: number | null;
  collateral_actuel_pct: number | null;
  frequence_echeance: string | null;
  jours_anticipation_lettre: number | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Acteur {
  id: string;
  transaction_id: string;
  role: string;
  nom: string;
  contact_nom: string | null;
  contact_email: string | null;
  contact_telephone: string | null;
  notes: string | null;
  created_at: string;
}

export interface Etape {
  id: string;
  transaction_id: string;
  pilier: string;
  titre: string;
  description: string | null;
  responsable: string | null;
  statut: EtapeStatut;
  date_prevue: string | null;
  date_realisation: string | null;
  ordre: number;
  created_at: string;
  updated_at: string;
}

export interface Echeance {
  id: string;
  transaction_id: string;
  type: string;
  date_echeance: string;
  montant: number | null;
  devise: string;
  statut: EcheanceStatut;
  responsable: string | null;
  date_realisation: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface DocumentRecord {
  id: string;
  transaction_id: string;
  echeance_id: string | null;
  type: string;
  nom: string;
  date_document: string | null;
  statut: DocumentStatut;
  reference: string | null;
  notes: string | null;
  created_at: string;
}
