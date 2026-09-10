import { TRANSACTION_STATUTS, TRANSACTION_TYPES_SUGGERES } from "@/lib/types";
import type { Transaction } from "@/lib/types";

export default function TransactionForm({
  transaction,
  action,
  submitLabel,
}: {
  transaction?: Transaction;
  action: (formData: FormData) => void;
  submitLabel: string;
}) {
  const t = transaction;

  return (
    <form action={action} className="space-y-8">
      <section className="card p-6">
        <h2 className="text-sm font-semibold text-navy-900 mb-4">Informations générales</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="field sm:col-span-2">
            <label className="label">Nom de la transaction *</label>
            <input name="name" required defaultValue={t?.name} className="input" placeholder="Ex : Cession NPL & TRS — BSIC / LIGDI / KARANGË" />
          </div>

          <div className="field">
            <label className="label">Type de transaction *</label>
            <input
              name="type"
              required
              defaultValue={t?.type ?? "TRS (Total Return Swap)"}
              list="transaction-types"
              className="input"
              placeholder="TRS, Cession de créances, Titrisation…"
            />
            <datalist id="transaction-types">
              {TRANSACTION_TYPES_SUGGERES.map((tt) => (
                <option key={tt} value={tt} />
              ))}
            </datalist>
          </div>

          <div className="field">
            <label className="label">Référence</label>
            <input name="reference" defaultValue={t?.reference ?? ""} className="input" placeholder="Ex : TRS-BSIC-001" />
          </div>

          <div className="field">
            <label className="label">Statut</label>
            <select name="statut" defaultValue={t?.statut ?? "En préparation"} className="input">
              {TRANSACTION_STATUTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>

          <div className="field">
            <label className="label">Devise</label>
            <input name="devise" defaultValue={t?.devise ?? "XOF"} className="input" />
          </div>

          <div className="field sm:col-span-2">
            <label className="label">Description</label>
            <textarea name="description" defaultValue={t?.description ?? ""} rows={3} className="input" />
          </div>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-sm font-semibold text-navy-900 mb-4">Dates clés</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="field">
            <label className="label">Date de signature</label>
            <input type="date" name="date_signature" defaultValue={t?.date_signature ?? ""} className="input" />
          </div>
          <div className="field">
            <label className="label">Date d&apos;entrée en vigueur</label>
            <input type="date" name="date_entree_vigueur" defaultValue={t?.date_entree_vigueur ?? ""} className="input" />
          </div>
          <div className="field">
            <label className="label">Date d&apos;expiration</label>
            <input type="date" name="date_expiration" defaultValue={t?.date_expiration ?? ""} className="input" />
          </div>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-sm font-semibold text-navy-900 mb-4">Portefeuille &amp; cash collatéral</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="field">
            <label className="label">Valeur nominale du portefeuille</label>
            <input type="number" step="any" name="valeur_portefeuille" defaultValue={t?.valeur_portefeuille ?? ""} className="input" />
          </div>
          <div className="field">
            <label className="label">Prix d&apos;acquisition</label>
            <input type="number" step="any" name="prix_acquisition" defaultValue={t?.prix_acquisition ?? ""} className="input" />
          </div>
          <div className="field">
            <label className="label">Décote (%)</label>
            <input type="number" step="any" name="decote_pct" defaultValue={t?.decote_pct ?? ""} className="input" />
          </div>
          <div className="field">
            <label className="label">Encours actuel</label>
            <input type="number" step="any" name="encours_actuel" defaultValue={t?.encours_actuel ?? ""} className="input" />
          </div>
          <div className="field">
            <label className="label">Nombre de débiteurs / emprunts</label>
            <input type="number" name="nombre_debiteurs" defaultValue={t?.nombre_debiteurs ?? ""} className="input" />
          </div>
          <div className="field">
            <label className="label">Cash collatéral cible (%)</label>
            <input type="number" step="any" name="collateral_cible_pct" defaultValue={t?.collateral_cible_pct ?? 115} className="input" />
          </div>
          <div className="field">
            <label className="label">Cash collatéral actuel (%)</label>
            <input type="number" step="any" name="collateral_actuel_pct" defaultValue={t?.collateral_actuel_pct ?? ""} className="input" />
          </div>
        </div>
      </section>

      <section className="card p-6">
        <h2 className="text-sm font-semibold text-navy-900 mb-4">Échéances &amp; suivi</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="field">
            <label className="label">Fréquence des échéances</label>
            <input name="frequence_echeance" defaultValue={t?.frequence_echeance ?? "Semestrielle"} className="input" placeholder="Semestrielle, Trimestrielle…" />
          </div>
          <div className="field">
            <label className="label">Anticipation lettre d&apos;instruction (jours ouvrés)</label>
            <input type="number" name="jours_anticipation_lettre" defaultValue={t?.jours_anticipation_lettre ?? 12} className="input" />
          </div>
          <div className="field sm:col-span-2">
            <label className="label">Notes</label>
            <textarea name="notes" defaultValue={t?.notes ?? ""} rows={3} className="input" />
          </div>
        </div>
      </section>

      {!transaction && (
        <label className="flex items-center gap-2 text-sm text-navy-800">
          <input type="checkbox" name="with_template" defaultChecked className="rounded border-gray-300 text-navy-800 focus:ring-navy-600" />
          Créer automatiquement les 5 piliers de suivi standards (convention, gestion, recouvrement, échéances, rapports)
        </label>
      )}

      <div className="flex gap-3">
        <button type="submit" className="btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
