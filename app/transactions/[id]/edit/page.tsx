import { notFound } from "next/navigation";
import TransactionForm from "@/components/TransactionForm";
import { getTransaction } from "@/lib/queries";
import { updateTransactionAction } from "@/lib/actions";

export default function EditTransactionPage({ params }: { params: { id: string } }) {
  const transaction = getTransaction(params.id);
  if (!transaction) notFound();

  const action = updateTransactionAction.bind(null, transaction.id);

  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-navy-900">Modifier la transaction</h1>
        <p className="text-sm text-gray-500 mt-1">{transaction.name}</p>
      </div>
      <TransactionForm transaction={transaction} action={action} submitLabel="Enregistrer les modifications" />
    </div>
  );
}
