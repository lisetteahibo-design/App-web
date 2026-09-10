import Link from "next/link";
import { notFound } from "next/navigation";
import { getTransaction, listActeurs, listEtapes, listEcheances, listDocuments } from "@/lib/queries";
import { deleteTransactionAction } from "@/lib/actions";
import Badge from "@/components/Badge";
import Tabs from "@/components/Tabs";
import DeleteButton from "@/components/DeleteButton";
import OverviewTab from "@/components/tabs/OverviewTab";
import ActeursTab from "@/components/tabs/ActeursTab";
import EtapesTab from "@/components/tabs/EtapesTab";
import PortefeuilleTab from "@/components/tabs/PortefeuilleTab";
import EcheancesTab from "@/components/tabs/EcheancesTab";
import DocumentsTab from "@/components/tabs/DocumentsTab";

export default function TransactionDetailPage({ params }: { params: { id: string } }) {
  const transaction = getTransaction(params.id);
  if (!transaction) notFound();

  const acteurs = listActeurs(transaction.id);
  const etapes = listEtapes(transaction.id);
  const echeances = listEcheances(transaction.id);
  const documents = listDocuments(transaction.id);

  const pendingEcheances = echeances.filter((e) => !["Réalisée", "Annulée"].includes(e.statut)).length;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div>
          <Link href="/transactions" className="text-xs text-navy-600 hover:underline">
            ← Toutes les transactions
          </Link>
          <h1 className="text-2xl font-semibold text-navy-900 mt-1">{transaction.name}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge>{transaction.statut}</Badge>
            <span className="text-sm text-gray-500">{transaction.type}</span>
            {transaction.reference && <span className="text-sm text-gray-400">· {transaction.reference}</span>}
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <Link href={`/transactions/${transaction.id}/edit`} className="btn-secondary">
            Modifier
          </Link>
          <DeleteButton
            action={deleteTransactionAction.bind(null, transaction.id)}
            confirmMessage="Supprimer définitivement cette transaction et toutes ses données associées ?"
            label="Supprimer"
            className="btn-danger"
          />
        </div>
      </div>

      <Tabs
        tabs={[
          {
            id: "apercu",
            label: "Vue d'ensemble",
            content: <OverviewTab transaction={transaction} acteurs={acteurs} etapes={etapes} />,
          },
          {
            id: "acteurs",
            label: "Acteurs",
            badge: acteurs.length,
            content: <ActeursTab transactionId={transaction.id} acteurs={acteurs} />,
          },
          {
            id: "etapes",
            label: "Étapes",
            badge: etapes.length,
            content: <EtapesTab transactionId={transaction.id} etapes={etapes} />,
          },
          {
            id: "portefeuille",
            label: "Portefeuille & collatéral",
            content: <PortefeuilleTab transaction={transaction} />,
          },
          {
            id: "echeances",
            label: "Échéances",
            badge: pendingEcheances,
            content: <EcheancesTab transactionId={transaction.id} echeances={echeances} devise={transaction.devise} />,
          },
          {
            id: "documents",
            label: "Documents",
            badge: documents.length,
            content: <DocumentsTab transactionId={transaction.id} documents={documents} />,
          },
        ]}
      />
    </div>
  );
}
