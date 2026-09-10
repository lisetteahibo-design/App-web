import type { DocumentRecord } from "@/lib/types";
import { DOCUMENT_STATUTS, DOCUMENT_TYPES } from "@/lib/types";
import { createDocumentAction, deleteDocumentAction } from "@/lib/actions";
import DeleteButton from "@/components/DeleteButton";
import Badge from "@/components/Badge";
import { formatDate } from "@/lib/dates";

export default function DocumentsTab({ transactionId, documents }: { transactionId: string; documents: DocumentRecord[] }) {
  const addAction = createDocumentAction.bind(null, transactionId);

  return (
    <div className="space-y-6">
      <div className="card overflow-hidden">
        {documents.length === 0 ? (
          <p className="p-6 text-sm text-gray-400">Aucun document archivé.</p>
        ) : (
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Document</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Type</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Date</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Référence</th>
                <th className="px-5 py-3 text-left font-medium text-gray-500">Statut</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {documents.map((d) => (
                <tr key={d.id}>
                  <td className="px-5 py-3 text-navy-900 font-medium">{d.nom}</td>
                  <td className="px-5 py-3 text-gray-600">{d.type}</td>
                  <td className="px-5 py-3 text-gray-600">{formatDate(d.date_document)}</td>
                  <td className="px-5 py-3 text-gray-500">{d.reference || "—"}</td>
                  <td className="px-5 py-3">
                    <Badge>{d.statut}</Badge>
                  </td>
                  <td className="px-5 py-3 text-right">
                    <DeleteButton action={deleteDocumentAction.bind(null, d.id, transactionId)} confirmMessage="Supprimer ce document ?" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="card p-6">
        <h2 className="text-sm font-semibold text-navy-900 mb-4">Ajouter / archiver un document</h2>
        <form action={addAction} className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="field sm:col-span-2">
            <label className="label">Nom *</label>
            <input name="nom" required className="input" placeholder="Ex : Lettre d'instruction — échéance du 30 avril" />
          </div>
          <div className="field">
            <label className="label">Type</label>
            <select name="type" defaultValue={DOCUMENT_TYPES[0]} className="input">
              {DOCUMENT_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="label">Statut</label>
            <select name="statut" defaultValue="Brouillon" className="input">
              {DOCUMENT_STATUTS.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
          </div>
          <div className="field">
            <label className="label">Date du document</label>
            <input type="date" name="date_document" className="input" />
          </div>
          <div className="field">
            <label className="label">Référence</label>
            <input name="reference" className="input" />
          </div>
          <div className="field sm:col-span-2">
            <label className="label">Notes</label>
            <textarea name="notes" rows={2} className="input" />
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
