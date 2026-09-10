import type { Acteur, Etape, Transaction } from "@/lib/types";
import { formatDate, formatMontant } from "@/lib/dates";
import Badge from "@/components/Badge";

export default function OverviewTab({
  transaction,
  acteurs,
  etapes,
}: {
  transaction: Transaction;
  acteurs: Acteur[];
  etapes: Etape[];
}) {
  const done = etapes.filter((e) => e.statut === "Terminé").length;
  const progress = etapes.length ? Math.round((done / etapes.length) * 100) : 0;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-navy-900 mb-3">Description</h2>
          <p className="text-sm text-gray-600 whitespace-pre-line">
            {transaction.description || "Aucune description renseignée."}
          </p>
        </div>

        <div className="card p-6">
          <h2 className="text-sm font-semibold text-navy-900 mb-4">Dates clés</h2>
          <dl className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <dt className="text-xs text-gray-500">Signature</dt>
              <dd className="text-navy-900 font-medium">{formatDate(transaction.date_signature)}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Entrée en vigueur</dt>
              <dd className="text-navy-900 font-medium">{formatDate(transaction.date_entree_vigueur)}</dd>
            </div>
            <div>
              <dt className="text-xs text-gray-500">Expiration</dt>
              <dd className="text-navy-900 font-medium">{formatDate(transaction.date_expiration)}</dd>
            </div>
          </dl>
        </div>

        <div className="card p-6">
          <h2 className="text-sm font-semibold text-navy-900 mb-4">Acteurs impliqués</h2>
          {acteurs.length === 0 ? (
            <p className="text-sm text-gray-400">Aucun acteur enregistré.</p>
          ) : (
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {acteurs.map((a) => (
                <li key={a.id} className="rounded-lg bg-gray-50 px-4 py-3">
                  <p className="text-xs text-gray-500">{a.role}</p>
                  <p className="text-sm font-medium text-navy-900">{a.nom}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        {transaction.notes && (
          <div className="card p-6">
            <h2 className="text-sm font-semibold text-navy-900 mb-3">Notes</h2>
            <p className="text-sm text-gray-600 whitespace-pre-line">{transaction.notes}</p>
          </div>
        )}
      </div>

      <div className="space-y-6">
        <div className="card p-6">
          <h2 className="text-sm font-semibold text-navy-900 mb-3">Statut</h2>
          <Badge>{transaction.statut}</Badge>
          <p className="text-xs text-gray-500 mt-3">Type</p>
          <p className="text-sm text-navy-900 font-medium">{transaction.type}</p>
        </div>

        <div className="card p-6">
          <h2 className="text-sm font-semibold text-navy-900 mb-3">Avancement du suivi</h2>
          <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
            <div className="h-full bg-navy-700" style={{ width: `${progress}%` }} />
          </div>
          <p className="text-xs text-gray-500 mt-2">
            {done} / {etapes.length} étapes terminées ({progress}%)
          </p>
        </div>

        <div className="card p-6">
          <h2 className="text-sm font-semibold text-navy-900 mb-3">Portefeuille</h2>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Valeur nominale</dt>
              <dd className="text-navy-900 font-medium">{formatMontant(transaction.valeur_portefeuille, transaction.devise)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Encours actuel</dt>
              <dd className="text-navy-900 font-medium">{formatMontant(transaction.encours_actuel, transaction.devise)}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Débiteurs</dt>
              <dd className="text-navy-900 font-medium">{transaction.nombre_debiteurs ?? "—"}</dd>
            </div>
          </dl>
        </div>
      </div>
    </div>
  );
}
