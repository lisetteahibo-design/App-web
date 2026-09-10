import type { Transaction } from "@/lib/types";
import { formatMontant } from "@/lib/dates";

export default function PortefeuilleTab({ transaction }: { transaction: Transaction }) {
  const collateralOk =
    transaction.collateral_cible_pct != null &&
    transaction.collateral_actuel_pct != null &&
    transaction.collateral_actuel_pct >= transaction.collateral_cible_pct;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="card p-6">
        <h2 className="text-sm font-semibold text-navy-900 mb-4">Portefeuille de créances</h2>
        <dl className="space-y-3 text-sm">
          <Row label="Valeur nominale" value={formatMontant(transaction.valeur_portefeuille, transaction.devise)} />
          <Row label="Prix d'acquisition" value={formatMontant(transaction.prix_acquisition, transaction.devise)} />
          <Row label="Décote" value={transaction.decote_pct != null ? `${transaction.decote_pct}%` : "—"} />
          <Row label="Encours actuel" value={formatMontant(transaction.encours_actuel, transaction.devise)} />
          <Row label="Nombre de débiteurs / emprunts" value={transaction.nombre_debiteurs?.toString() ?? "—"} />
        </dl>
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-semibold text-navy-900 mb-4">Cash collatéral</h2>
        {transaction.collateral_cible_pct == null ? (
          <p className="text-sm text-gray-400">Aucune information de collatéral renseignée.</p>
        ) : (
          <>
            <div className="flex items-end justify-between mb-2">
              <span className="text-3xl font-semibold text-navy-900">{transaction.collateral_actuel_pct ?? "—"}%</span>
              <span className="text-xs text-gray-500">cible : {transaction.collateral_cible_pct}%</span>
            </div>
            <div className="w-full h-2 rounded-full bg-gray-100 overflow-hidden">
              <div
                className={`h-full ${collateralOk ? "bg-emerald-600" : "bg-amber-500"}`}
                style={{ width: `${Math.min(100, ((transaction.collateral_actuel_pct ?? 0) / transaction.collateral_cible_pct) * 100)}%` }}
              />
            </div>
            <p className={`text-xs mt-2 ${collateralOk ? "text-emerald-600" : "text-amber-600"}`}>
              {collateralOk
                ? "Le compte nanti couvre le seuil requis."
                : "Le compte nanti est en-dessous du seuil cible — un abondement peut être nécessaire."}
            </p>
          </>
        )}

        <div className="mt-6 pt-6 border-t border-gray-100">
          <h3 className="text-xs font-semibold uppercase tracking-wide text-gray-500 mb-2">Rappel de la mécanique</h3>
          <p className="text-xs text-gray-500 leading-relaxed">
            Un compte nanti, alimenté par la Banque Cédante, doit représenter à tout moment le pourcentage cible de
            l&apos;encours du prêt. En cas d&apos;impayé, la banque est autorisée à débiter ce compte de manière
            irrévocable pour couvrir l&apos;échéance due à l&apos;investisseur.
          </p>
        </div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between">
      <dt className="text-gray-500">{label}</dt>
      <dd className="text-navy-900 font-medium">{value}</dd>
    </div>
  );
}
