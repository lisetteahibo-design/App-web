import Link from "next/link";
import { listTransactions } from "@/lib/queries";
import { TRANSACTION_STATUTS } from "@/lib/types";
import { formatDate, formatMontant } from "@/lib/dates";
import Badge from "@/components/Badge";
import EmptyState from "@/components/EmptyState";

export default function TransactionsPage({
  searchParams,
}: {
  searchParams: { statut?: string; type?: string; q?: string };
}) {
  const transactions = listTransactions({
    statut: searchParams.statut,
    type: searchParams.type,
    q: searchParams.q,
  });

  const types = Array.from(new Set(listTransactions().map((t) => t.type)));

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-navy-900">Transactions</h1>
          <p className="text-sm text-gray-500 mt-1">Toutes les transactions TRS et opérations suivies.</p>
        </div>
        <Link href="/transactions/new" className="btn-primary">
          + Nouvelle transaction
        </Link>
      </div>

      <form className="card p-4 flex flex-col sm:flex-row gap-3">
        <input name="q" defaultValue={searchParams.q} placeholder="Rechercher par nom ou référence…" className="input sm:max-w-xs" />
        <select name="statut" defaultValue={searchParams.statut ?? ""} className="input sm:max-w-[180px]">
          <option value="">Tous les statuts</option>
          {TRANSACTION_STATUTS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
        <select name="type" defaultValue={searchParams.type ?? ""} className="input sm:max-w-[220px]">
          <option value="">Tous les types</option>
          {types.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
        <button type="submit" className="btn-secondary">
          Filtrer
        </button>
        {(searchParams.q || searchParams.statut || searchParams.type) && (
          <Link href="/transactions" className="btn-ghost">
            Réinitialiser
          </Link>
        )}
      </form>

      <div className="card overflow-hidden">
        {transactions.length === 0 ? (
          <EmptyState
            title="Aucune transaction trouvée"
            hint="Ajustez vos filtres ou créez une nouvelle transaction."
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Transaction</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Type</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Statut</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Encours</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Expiration</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50">
                    <td className="px-5 py-4">
                      <Link href={`/transactions/${t.id}`} className="font-medium text-navy-900 hover:underline">
                        {t.name}
                      </Link>
                      {t.reference && <p className="text-xs text-gray-400 mt-0.5">{t.reference}</p>}
                    </td>
                    <td className="px-5 py-4 text-gray-600">{t.type}</td>
                    <td className="px-5 py-4">
                      <Badge>{t.statut}</Badge>
                    </td>
                    <td className="px-5 py-4 text-gray-600">
                      {t.encours_actuel != null ? formatMontant(t.encours_actuel, t.devise) : "—"}
                    </td>
                    <td className="px-5 py-4 text-gray-600">{formatDate(t.date_expiration)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
