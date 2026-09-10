# TRS Transactions

Application de suivi des transactions TRS (Total Return Swap) et de toute autre opération de
cession / gestion / recouvrement de créances (cession NPL, titrisation, affacturage, etc.).

Construite à partir du manuel de procédure de gestion et de recouvrement de créances (opération
TRS — BSIC / LIGDI SAS / KARANGË SAS) : suivi des acteurs, des 5 piliers de la procédure
(convention, gestion et reporting, recouvrement et flux financiers, échéances semestrielles,
production des rapports), du portefeuille et du cash collatéral, des échéances et des documents /
lettres d'instruction.

## Stack technique

- **Next.js 14** (App Router) + **TypeScript** + **Tailwind CSS**
- Base de données **SQLite** via le module natif `node:sqlite` de Node.js (aucune dépendance
  native à compiler) — fichier local `data/trs.db`
- Mutations via **Server Actions** (pas d'API REST séparée)

## Démarrage

```bash
npm install
npm run seed   # crée une transaction d'exemple (BSIC / LIGDI / KARANGË)
npm run dev    # http://localhost:3000
```

Pour la production :

```bash
npm run build
npm start
```

## Structure

- `app/` — pages (tableau de bord, liste des transactions, détail à onglets, formulaires)
- `components/` — composants UI partagés et onglets de la fiche transaction
- `lib/db.ts` — schéma SQLite et connexion
- `lib/queries.ts` — accès aux données
- `lib/actions.ts` — Server Actions (créer / modifier / supprimer)
- `scripts/seed.ts` — jeu de données d'exemple

## Logo

Le fichier `public/logo.svg` est un monogramme temporaire (aucun logo n'a été transmis dans la
conversation — seul le manuel de procédure a été fourni). Remplacez ce fichier par le logo
officiel de l'entreprise pour qu'il apparaisse dans la barre latérale, au-dessus du titre
« TRS TRANSACTIONS ».
