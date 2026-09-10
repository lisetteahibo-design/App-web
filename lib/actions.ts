"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import * as q from "./queries";
import { PILIERS } from "./types";

function str(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function strOrNull(formData: FormData, key: string): string | null {
  const v = str(formData, key);
  return v === "" ? null : v;
}

function numOrNull(formData: FormData, key: string): number | null {
  const v = str(formData, key);
  if (v === "") return null;
  const n = Number(v);
  return Number.isNaN(n) ? null : n;
}

const DEFAULT_ETAPES: { pilier: string; titre: string }[] = [
  { pilier: PILIERS[0], titre: "Identification et validation du portefeuille à céder" },
  { pilier: PILIERS[0], titre: "Sélection du cabinet de conseils juridiques" },
  { pilier: PILIERS[0], titre: "Signature de l'acte de cession" },
  { pilier: PILIERS[0], titre: "Signature de la convention de gestion et de recouvrement" },
  { pilier: PILIERS[1], titre: "Suivi régulier du portefeuille de créances" },
  { pilier: PILIERS[1], titre: "Reporting trimestriel (composition, statut, performance)" },
  { pilier: PILIERS[2], titre: "Encaissement des créances auprès des débiteurs" },
  { pilier: PILIERS[2], titre: "Réversion des fonds au SPV acquéreur" },
  { pilier: PILIERS[3], titre: "Envoi de la lettre d'instruction (avant échéance)" },
  { pilier: PILIERS[3], titre: "Virement de l'échéance vers l'investisseur" },
  { pilier: PILIERS[4], titre: "Élaboration du rapport de gestion du portefeuille" },
  { pilier: PILIERS[4], titre: "Validation et archivage du rapport" },
];

function transactionInputFromForm(formData: FormData): q.TransactionInput {
  return {
    name: str(formData, "name"),
    type: str(formData, "type"),
    reference: strOrNull(formData, "reference"),
    statut: str(formData, "statut") || "En préparation",
    description: strOrNull(formData, "description"),
    date_signature: strOrNull(formData, "date_signature"),
    date_entree_vigueur: strOrNull(formData, "date_entree_vigueur"),
    date_expiration: strOrNull(formData, "date_expiration"),
    devise: str(formData, "devise") || "XOF",
    valeur_portefeuille: numOrNull(formData, "valeur_portefeuille"),
    prix_acquisition: numOrNull(formData, "prix_acquisition"),
    decote_pct: numOrNull(formData, "decote_pct"),
    encours_actuel: numOrNull(formData, "encours_actuel"),
    nombre_debiteurs: numOrNull(formData, "nombre_debiteurs"),
    collateral_cible_pct: numOrNull(formData, "collateral_cible_pct"),
    collateral_actuel_pct: numOrNull(formData, "collateral_actuel_pct"),
    frequence_echeance: strOrNull(formData, "frequence_echeance"),
    jours_anticipation_lettre: numOrNull(formData, "jours_anticipation_lettre"),
    notes: strOrNull(formData, "notes"),
  };
}

export async function createTransactionAction(formData: FormData) {
  const input = transactionInputFromForm(formData);
  const tx = q.createTransaction(input);

  const withTemplate = str(formData, "with_template");
  if (withTemplate === "on") {
    DEFAULT_ETAPES.forEach((e, idx) => {
      q.createEtape(tx.id, {
        pilier: e.pilier,
        titre: e.titre,
        statut: "À faire",
        ordre: idx,
      });
    });
  }

  revalidatePath("/transactions");
  revalidatePath("/");
  redirect(`/transactions/${tx.id}`);
}

export async function updateTransactionAction(id: string, formData: FormData) {
  const input = transactionInputFromForm(formData);
  q.updateTransaction(id, input);
  revalidatePath(`/transactions/${id}`);
  revalidatePath("/transactions");
  revalidatePath("/");
  redirect(`/transactions/${id}`);
}

export async function deleteTransactionAction(id: string) {
  q.deleteTransaction(id);
  revalidatePath("/transactions");
  revalidatePath("/");
  redirect("/transactions");
}

// ---- Acteurs ----

export async function createActeurAction(transactionId: string, formData: FormData) {
  q.createActeur(transactionId, {
    role: str(formData, "role"),
    nom: str(formData, "nom"),
    contact_nom: strOrNull(formData, "contact_nom"),
    contact_email: strOrNull(formData, "contact_email"),
    contact_telephone: strOrNull(formData, "contact_telephone"),
    notes: strOrNull(formData, "notes"),
  });
  revalidatePath(`/transactions/${transactionId}`);
}

export async function deleteActeurAction(id: string, transactionId: string) {
  q.deleteActeur(id, transactionId);
  revalidatePath(`/transactions/${transactionId}`);
}

// ---- Etapes ----

export async function createEtapeAction(transactionId: string, formData: FormData) {
  q.createEtape(transactionId, {
    pilier: str(formData, "pilier"),
    titre: str(formData, "titre"),
    description: strOrNull(formData, "description"),
    responsable: strOrNull(formData, "responsable"),
    statut: str(formData, "statut") || "À faire",
    date_prevue: strOrNull(formData, "date_prevue"),
  });
  revalidatePath(`/transactions/${transactionId}`);
}

export async function updateEtapeStatutAction(
  id: string,
  transactionId: string,
  statut: string
) {
  q.updateEtape(id, transactionId, {
    statut,
    date_realisation: statut === "Terminé" ? new Date().toISOString().slice(0, 10) : null,
  });
  revalidatePath(`/transactions/${transactionId}`);
}

export async function deleteEtapeAction(id: string, transactionId: string) {
  q.deleteEtape(id, transactionId);
  revalidatePath(`/transactions/${transactionId}`);
}

// ---- Echeances ----

export async function createEcheanceAction(transactionId: string, formData: FormData) {
  q.createEcheance(transactionId, {
    type: str(formData, "type"),
    date_echeance: str(formData, "date_echeance"),
    montant: numOrNull(formData, "montant"),
    devise: str(formData, "devise") || "XOF",
    statut: str(formData, "statut") || "À venir",
    responsable: strOrNull(formData, "responsable"),
    notes: strOrNull(formData, "notes"),
  });
  revalidatePath(`/transactions/${transactionId}`);
  revalidatePath("/");
}

export async function updateEcheanceStatutAction(
  id: string,
  transactionId: string,
  statut: string
) {
  q.updateEcheance(id, transactionId, {
    statut,
    date_realisation: statut === "Réalisée" ? new Date().toISOString().slice(0, 10) : null,
  });
  revalidatePath(`/transactions/${transactionId}`);
  revalidatePath("/");
}

export async function deleteEcheanceAction(id: string, transactionId: string) {
  q.deleteEcheance(id, transactionId);
  revalidatePath(`/transactions/${transactionId}`);
  revalidatePath("/");
}

// ---- Documents ----

export async function createDocumentAction(transactionId: string, formData: FormData) {
  q.createDocument(transactionId, {
    type: str(formData, "type"),
    nom: str(formData, "nom"),
    date_document: strOrNull(formData, "date_document"),
    statut: str(formData, "statut") || "Brouillon",
    reference: strOrNull(formData, "reference"),
    notes: strOrNull(formData, "notes"),
  });
  revalidatePath(`/transactions/${transactionId}`);
}

export async function deleteDocumentAction(id: string, transactionId: string) {
  q.deleteDocument(id, transactionId);
  revalidatePath(`/transactions/${transactionId}`);
}
