import type { Acteur } from "@/lib/types";
import { ACTEUR_ROLES } from "@/lib/types";
import { createActeurAction, deleteActeurAction } from "@/lib/actions";
import DeleteButton from "@/components/DeleteButton";

export default function ActeursTab({ transactionId, acteurs }: { transactionId: string; acteurs: Acteur[] }) {
  const addAction = createActeurAction.bind(null, transactionId);

  return (
    <div className="space-y-6">
      <div className="card overflow-hidden">
        {acteurs.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">Aucun acteur enregistré pour cette transaction.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Rôle</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Nom</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Contact</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Notes</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {acteurs.map((a) => (
                <tr key={a.id}>
                  <td className="px-5 py-3 text-navy-800 font-medium">{a.role}</td>
                  <td className="px-5 py-3 text-navy-900">{a.nom}</td>
                  <td className="px-5 py-3 text-gray-600">
                    {[a.contact_nom, a.contact_email, a.contact_telephone].filter(Boolean).join(" · ") || "—"}
                  </td>
                  <td className="px-5 py-3 text-gray-500">{a.notes || "—"}</td>
                  <td className="px-5 py-3 text-right">
                    <DeleteButton action={deleteActeurAction.bind(null, a.id, transactionId)} confirmMessage="Supprimer cet acteur ?" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-semibold text-navy-900 mb-4">Ajouter un acteur</h2>
        <form action={addAction} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="field">
            <label className="label">Rôle *</label>
            <input name="role" required list="acteur-roles" className="input" placeholder="Banque Cédante, SPV Acquéreur…" />
            <datalist id="acteur-roles">
              {ACTEUR_ROLES.map((r) => (
                <option key={r} value={r} />
              ))}
            </datalist>
          </div>
          <div className="field">
            <label className="label">Nom *</label>
            <input name="nom" required className="input" placeholder="Ex : LIGDI SAS" />
          </div>
          <div className="field">
            <label className="label">Contact (nom)</label>
            <input name="contact_nom" className="input" />
          </div>
          <div className="field">
            <label className="label">Email</label>
            <input type="email" name="contact_email" className="input" />
          </div>
          <div className="field">
            <label className="label">Téléphone</label>
            <input name="contact_telephone" className="input" />
          </div>
          <div className="field">
            <label className="label">Notes</label>
            <input name="notes" className="input" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary">
              Ajouter
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
