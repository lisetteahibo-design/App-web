import { listTransactions, createTransaction, createActeur, createEtape, createEcheance, createDocument } from "../lib/queries";
import { PILIERS } from "../lib/types";

function main() {
  const existing = listTransactions();
  if (existing.length > 0) {
    console.log(`La base contient déjà ${existing.length} transaction(s). Seed ignoré.`);
    return;
  }

  const tx = createTransaction({
    name: "Cession NPL & Total Return Swap — BSIC / LIGDI / KARANGË",
    type: "TRS (Total Return Swap)",
    reference: "TRS-BSIC-001",
    statut: "En cours",
    description:
      "Opération de cession du portefeuille de créances NPL de la BSIC SA au SPV Acquéreur LIGDI SAS, combinée à un Total Return Swap avec le SPV Investisseur KARANGË SAS, arrangée par EDEN & MBG Capital.",
    date_signature: "2024-01-15",
    date_entree_vigueur: "2024-01-15",
    date_expiration: "2029-01-15",
    devise: "XOF",
    valeur_portefeuille: 15000000000,
    prix_acquisition: 9750000000,
    decote_pct: 35,
    encours_actuel: 8900000000,
    nombre_debiteurs: 214,
    collateral_cible_pct: 115,
    collateral_actuel_pct: 118,
    frequence_echeance: "Semestrielle",
    jours_anticipation_lettre: 12,
    notes:
      "Reporting trimestriel dû le dernier jour ouvré de mars, juin, octobre et décembre. Réversion semestrielle des flux les 30 avril et 31 octobre.",
  });

  createActeur(tx.id, {
    role: "Arrangeur",
    nom: "EDEN & MBG Capital",
    contact_nom: "Direction Financements Structurés",
    notes: "Plateforme panafricaine de banque d'investissement, basée à Dakar.",
  });
  createActeur(tx.id, {
    role: "Banque Cédante",
    nom: "BSIC SA",
    contact_nom: "Chargé de clientèle BSIC",
    notes: "Filiale du Groupe BSIC, agit également comme mandataire de recouvrement.",
  });
  createActeur(tx.id, {
    role: "SPV Acquéreur",
    nom: "LIGDI SAS",
    notes: "Rachète le portefeuille de créances auprès de la BSIC SA.",
  });
  createActeur(tx.id, {
    role: "SPV Investisseur",
    nom: "KARANGË SAS",
    notes: "Porte le financement et bénéficie du cash collatéral.",
  });
  createActeur(tx.id, {
    role: "Cabinet de Conseils Juridiques",
    nom: "Cabinet Juridique Partenaire",
    notes: "Rédige la note de faisabilité, l'acte de cession et le contrat de recouvrement.",
  });

  const etapes: { pilier: string; titre: string; statut: string; date_prevue?: string; date_realisation?: string }[] = [
    { pilier: PILIERS[0], titre: "Identification et validation du portefeuille à céder", statut: "Terminé", date_realisation: "2023-11-10" },
    { pilier: PILIERS[0], titre: "Sélection du cabinet de conseils juridiques", statut: "Terminé", date_realisation: "2023-11-20" },
    { pilier: PILIERS[0], titre: "Signature de l'acte de cession du portefeuille", statut: "Terminé", date_realisation: "2024-01-15" },
    { pilier: PILIERS[0], titre: "Signature de la convention de gestion et de recouvrement", statut: "Terminé", date_realisation: "2024-01-15" },
    { pilier: PILIERS[1], titre: "Mise en place du suivi régulier du portefeuille", statut: "Terminé", date_realisation: "2024-02-01" },
    { pilier: PILIERS[1], titre: "Reporting trimestriel — septembre", statut: "En cours", date_prevue: "2026-09-30" },
    { pilier: PILIERS[2], titre: "Encaissement des créances auprès des débiteurs", statut: "En cours" },
    { pilier: PILIERS[2], titre: "Réversion des fonds vers LIGDI SAS", statut: "En cours" },
    { pilier: PILIERS[3], titre: "Lettre d'instruction — échéance du 30 avril", statut: "Terminé", date_realisation: "2026-04-16" },
    { pilier: PILIERS[3], titre: "Lettre d'instruction — échéance du 31 octobre", statut: "À faire", date_prevue: "2026-10-14" },
    { pilier: PILIERS[4], titre: "Élaboration du rapport de gestion T3", statut: "À faire", date_prevue: "2026-09-30" },
    { pilier: PILIERS[4], titre: "Validation et archivage du rapport T2", statut: "Terminé", date_realisation: "2026-06-29" },
  ];
  etapes.forEach((e, idx) =>
    createEtape(tx.id, {
      pilier: e.pilier,
      titre: e.titre,
      statut: e.statut,
      date_prevue: e.date_prevue ?? null,
      date_realisation: e.date_realisation ?? null,
      ordre: idx,
    })
  );

  const echeances: { type: string; date_echeance: string; montant: number; statut: string; date_realisation?: string }[] = [
    { type: "Reporting trimestriel", date_echeance: "2025-12-30", montant: null as unknown as number, statut: "Réalisée", date_realisation: "2025-12-30" },
    { type: "Lettre d'instruction", date_echeance: "2026-04-16", montant: null as unknown as number, statut: "Réalisée", date_realisation: "2026-04-16" },
    { type: "Reversement semestriel", date_echeance: "2026-04-30", montant: 620000000, statut: "Réalisée", date_realisation: "2026-04-30" },
    { type: "Renouvellement cash collatéral", date_echeance: "2026-06-30", montant: null as unknown as number, statut: "Réalisée", date_realisation: "2026-06-30" },
    { type: "Reporting trimestriel", date_echeance: "2026-06-29", montant: null as unknown as number, statut: "Réalisée", date_realisation: "2026-06-29" },
    { type: "Reporting trimestriel", date_echeance: "2026-09-30", montant: null as unknown as number, statut: "À venir" },
    { type: "Lettre d'instruction", date_echeance: "2026-10-14", montant: null as unknown as number, statut: "À venir" },
    { type: "Reversement semestriel", date_echeance: "2026-10-31", montant: 645000000, statut: "À venir" },
  ];
  echeances.forEach((e) => {
    const created = createEcheance(tx.id, {
      type: e.type,
      date_echeance: e.date_echeance,
      montant: e.montant ?? null,
      devise: "XOF",
      statut: e.statut,
      date_realisation: e.date_realisation ?? null,
      responsable: e.type === "Lettre d'instruction" ? "LIGDI SAS" : "BSIC SA",
    });
    if (e.type === "Lettre d'instruction" || e.statut === "Réalisée") {
      createDocument(tx.id, {
        echeance_id: created.id,
        type: e.type === "Lettre d'instruction" ? "Lettre d'instruction" : "Rapport de gestion",
        nom:
          e.type === "Lettre d'instruction"
            ? `Lettre d'instruction — échéance du ${e.date_echeance}`
            : `Rapport de gestion — ${e.date_echeance}`,
        date_document: e.date_realisation ?? e.date_echeance,
        statut: e.statut === "Réalisée" ? "Archivé" : "Brouillon",
      });
    }
  });

  createDocument(tx.id, {
    type: "Convention de gestion",
    nom: "Convention de gestion et de recouvrement du Portefeuille de Créances",
    date_document: "2024-01-15",
    statut: "Archivé",
    reference: "CONV-2024-001",
  });
  createDocument(tx.id, {
    type: "Acte de cession",
    nom: "Acte de cession du Portefeuille de Créances BSIC → LIGDI SAS",
    date_document: "2024-01-15",
    statut: "Archivé",
    reference: "ACT-2024-001",
  });

  console.log("Transaction d'exemple créée :", tx.id);
}

main();
