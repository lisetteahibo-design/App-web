import TransactionForm from "@/components/TransactionForm";
import { createTransactionAction } from "@/lib/actions";

export default function NewTransactionPage() {
  return (
    <div className="space-y-6 max-w-3xl">
      <div>
        <h1 className="text-2xl font-semibold text-navy-900">Nouvelle transaction</h1>
        <p className="text-sm text-gray-500 mt-1">
          Créez le suivi d&apos;un TRS ou de tout autre type d&apos;opération de cession / gestion / recouvrement de créances.
        </p>
      </div>
      <TransactionForm action={createTransactionAction} submitLabel="Créer la transaction" />
    </div>
  );
}
