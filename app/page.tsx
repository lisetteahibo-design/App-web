import Link from "next/link";
import { getDashboardStats, listTransactions } from "@/lib/queries";

export const dynamic = "force-dynamic";
import { formatDate, formatMontant, daysUntil } from "@/lib/dates";
import StatCard from "@/components/StatCard";
import Badge from "@/components/Badge";
import EmptyState from "@/components/EmptyState";

export default function DashboardPage() {
  const stats = getDashboardStats();
  const recent = listTransactions().slice(0, 5);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-navy-900">Tableau de bord</h1>
        <p className="text-sm text-gray-500 mt-1">
          Vue d&apos;ensemble du suivi des transactions TRS et opérations de gestion / recouvrement de créances.
        </p>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Transactions" value={stats.totalTransactions} sub={`${stats.enCours} en cours`} />
        <StatCard label="Clôturées" value={stats.clôturées} tone="success" />
        <StatCard label="Suspendues" value={stats.suspendues} tone={stats.suspendues > 0 ? "warning" : "default"} />
        <StatCard
          label="Encours total"
          value={formatMontant(stats.totalEncours || 0)}
          sub="Toutes transactions confondues"
        />
      </div>

      {stats.overdue.length > 0 && (
        <div className="card p-5 border-red-200 bg-red-50/40">
          <h2 className="text-sm font-semibold text-red-700 mb-3">Échéances en retard ({stats.overdue.length})</h2>
          <ul className="space-y-2">
            {stats.overdue.map((e) => (
              <li key={e.id} className="flex items-center justify-between text-sm">
                <Link href={`/transactions/${e.transaction_id}`} className="text-navy-800 hover:underline">
                  {e.transaction_name} — {e.type}
                </Link>
                <span className="text-red-600 font-medium">{formatDate(e.date_echeance)}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {stats.collateralAlerts.length > 0 && (
        <div className="card p-5 border-amber-200 bg-amber-50/40">
          <h2 className="text-sm font-semibold text-amber-700 mb-3">
            Cash collatéral sous le seuil cible ({stats.collateralAlerts.length})
          </h2>
          <ul className="space-y-2">
            {stats.collateralAlerts.map((t) => (
              <li key={t.id} className="flex items-center justify-between text-sm">
                <Link href={`/transactions/${t.id}`} className="text-navy-800 hover:underline">
                  {t.name}
                </Link>
                <span className="text-amber-700 font-medium">
                  {t.collateral_actuel_pct}% / {t.collateral_cible_pct}% cible
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-navy-900 mb-4">Échéances à venir (30 jours)</h2>
          {stats.upcoming.length === 0 ? (
            <EmptyState title="Aucune échéance dans les 30 prochains jours" />
          ) : (
            <ul className="divide-y divide-gray-100">
              {stats.upcoming.map((e) => {
                const d = daysUntil(e.date_echeance);
                return (
                  <li key={e.id} className="py-3 flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <Link href={`/transactions/${e.transaction_id}`} className="text-sm font-medium text-navy-900 hover:underline block truncate">
                        {e.type}
                      </Link>
                      <p className="text-xs text-gray-500 truncate">{e.transaction_name}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm text-navy-800">{formatDate(e.date_echeance)}</p>
                      <p className="text-xs text-gray-400">{d === 0 ? "aujourd'hui" : d > 0 ? `dans ${d} j` : `${-d} j de retard`}</p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-navy-900">Transactions récentes</h2>
            <Link href="/transactions" className="text-xs font-medium text-navy-700 hover:underline">
              Voir tout
            </Link>
          </div>
          {recent.length === 0 ? (
            <EmptyState title="Aucune transaction pour le moment" hint="Créez votre première transaction pour commencer le suivi." />
          ) : (
            <ul className="divide-y divide-gray-100">
              {recent.map((t) => (
                <li key={t.id} className="py-3 flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <Link href={`/transactions/${t.id}`} className="text-sm font-medium text-navy-900 hover:underline block truncate">
                      {t.name}
                    </Link>
                    <p className="text-xs text-gray-500 truncate">{t.type}</p>
                  </div>
                  <Badge>{t.statut}</Badge>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      {stats.byType.length > 0 && (
        <div className="card p-5">
          <h2 className="text-sm font-semibold text-navy-900 mb-4">Répartition par type de transaction</h2>
          <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {stats.byType.map((bt) => (
              <li key={bt.type} className="flex items-center justify-between rounded-lg bg-gray-50 px-4 py-3">
                <span className="text-sm text-navy-800">{bt.type}</span>
                <span className="text-sm font-semibold text-navy-900">{bt.count}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
