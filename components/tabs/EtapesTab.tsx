import type { Etape } from "@/lib/types";
import { ETAPE_STATUTS, PILIERS } from "@/lib/types";
import { createEtapeAction, deleteEtapeAction, updateEtapeStatutAction } from "@/lib/actions";
import DeleteButton from "@/components/DeleteButton";
import StatusSelect from "@/components/StatusSelect";
import { formatDate } from "@/lib/dates";

export default function EtapesTab({ transactionId, etapes }: { transactionId: string; etapes: Etape[] }) {
  const addAction = createEtapeAction.bind(null, transactionId);
  const groups: { pilier: string; items: Etape[] }[] = PILIERS.map((p) => ({
    pilier: p,
    items: etapes.filter((e) => e.pilier === p),
  }));
  const autres = etapes.filter((e) => !(PILIERS as readonly string[]).includes(e.pilier));
  if (autres.length) groups.push({ pilier: "Autre", items: autres });

  return (
    <div className="space-y-6">
      {groups
        .filter((g) => g.items.length > 0)
        .map((g) => (
          <div key={g.pilier} className="card p-5">
            <h3 className="text-sm font-semibold text-navy-900 mb-3">{g.pilier}</h3>
            <ul className="divide-y divide-gray-100">
              {g.items.map((e) => (
                <li key={e.id} className="py-3 flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-navy-900">{e.titre}</p>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {e.responsable && <span>{e.responsable} · </span>}
                      {e.date_realisation
                        ? `réalisé le ${formatDate(e.date_realisation)}`
                        : e.date_prevue
                        ? `prévu le ${formatDate(e.date_prevue)}`
                        : "aucune date"}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <StatusSelect
                      value={e.statut}
                      options={ETAPE_STATUTS}
                      onChange={updateEtapeStatutAction.bind(null, e.id, transactionId)}
                    />
                    <DeleteButton action={deleteEtapeAction.bind(null, e.id, transactionId)} confirmMessage="Supprimer cette étape ?" />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        ))}

      {etapes.length === 0 && (
        <div className="card p-6">
          <p className="text-sm text-gray-400">Aucune étape définie pour cette transaction.</p>
        </div>
      )}

      <div className="card p-6">
        <h2 className="text-sm font-semibold text-navy-900 mb-4">Ajouter une étape</h2>
        <form action={addAction} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="field sm:col-span-2">
            <label className="label">Titre *</label>
            <input name="titre" required className="input" placeholder="Ex : Envoi de la lettre d'instruction" />
          </div>
          <div className="field">
            <label className="label">Pilier</label>
            <select name="pilier" className="input" defaultValue={PILIERS[0]}>
              {PILIERS.map((p) => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="label">Statut</label>
            <select name="statut" className="input" defaultValue="À faire">
              {ETAPE_STATUTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="label">Responsable</label>
            <input name="responsable" className="input" placeholder="Ex : BSIC SA" />
          </div>
          <div className="field">
            <label className="label">Date prévue</label>
            <input type="date" name="date_prevue" className="input" />
          </div>
          <div className="field sm:col-span-2">
            <label className="label">Description</label>
            <textarea name="description" rows={2} className="input" />
          </div>
          <div className="sm:col-span-2">
            <button type="submit" className="btn-primary">
              Ajouter l&apos;étape
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
