import type { Echeance } from "@/lib/types";
import { ECHEANCE_STATUTS, ECHEANCE_TYPES } from "@/lib/types";
import { createEcheanceAction, deleteEcheanceAction, updateEcheanceStatutAction } from "@/lib/actions";
import DeleteButton from "@/components/DeleteButton";
import StatusSelect from "@/components/StatusSelect";
import { formatDate, formatMontant, isOverdue } from "@/lib/dates";

export default function EcheancesTab({ transactionId, echeances, devise }: { transactionId: string; echeances: Echeance[]; devise: string }) {
  const addAction = createEcheanceAction.bind(null, transactionId);

  return (
    <div className="space-y-6">
      <div className="card overflow-hidden">
        {echeances.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">Aucune échéance planifiée.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Type</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Date</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Montant</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Responsable</th>
                  <th className="px-5 py-3 text-left font-medium text-gray-500">Statut</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {echeances.map((e) => {
                  const late = isOverdue(e.date_echeance) && !["Réalisée", "Annulée"].includes(e.statut);
                  return (
                    <tr key={e.id} className={late ? "bg-red-50/40" : undefined}>
                      <td className="px-5 py-3 text-navy-900 font-medium">{e.type}</td>
                      <td className={`px-5 py-3 ${late ? "text-red-600 font-medium" : "text-gray-600"}`}>{formatDate(e.date_echeance)}</td>
                      <td className="px-5 py-3 text-gray-600">{e.montant != null ? formatMontant(e.montant, e.devise ?? devise) : "—"}</td>
                      <td className="px-5 py-3 text-gray-600">{e.responsable || "—"}</td>
                      <td className="px-5 py-3">
                        <StatusSelect
                          value={e.statut}
                          options={ECHEANCE_STATUTS}
                          onChange={updateEcheanceStatutAction.bind(null, e.id, transactionId)}
                        />
                      </td>
                      <td className="px-5 py-3 text-right">
                        <DeleteButton action={deleteEcheanceAction.bind(null, e.id, transactionId)} confirmMessage="Supprimer cette échéance ?" />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-semibold text-navy-900 mb-4">Ajouter une échéance</h2>
        <form action={addAction} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="field">
            <label className="label">Type *</label>
            <input name="type" required list="echeance-types" className="input" placeholder="Reversement semestriel…" />
            <datalist id="echeance-types">
              {ECHEANCE_TYPES.map((t) => (
                <option key={t} value={t} />
              ))}
            </datalist>
          </div>
          <div className="field">
            <label className="label">Date *</label>
            <input type="date" name="date_echeance" required className="input" />
          </div>
          <div className="field">
            <label className="label">Montant</label>
            <input type="number" step="any" name="montant" className="input" />
          </div>
          <div className="field">
            <label className="label">Devise</label>
            <input name="devise" defaultValue={devise} className="input" />
          </div>
          <div className="field">
            <label className="label">Statut</label>
            <select name="statut" defaultValue="À venir" className="input">
              {ECHEANCE_STATUTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="label">Responsable</label>
            <input name="responsable" className="input" />
          </div>
          <div className="field sm:col-span-2">
            <label className="label">Notes</label>
            <textarea name="notes" rows={2} className="input" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary">
              Ajouter l&apos;échéance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
