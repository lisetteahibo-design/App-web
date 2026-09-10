"use client";

import { useTransition } from "react";

export default function DeleteButton({
  action,
  confirmMessage = "Confirmer la suppression ?",
  label = "Supprimer",
  className = "text-xs text-red-600 hover:underline",
}: {
  action: () => Promise<void>;
  confirmMessage?: string;
  label?: string;
  className?: string;
}) {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      type="button"
      disabled={isPending}
      onClick={() => {
        if (window.confirm(confirmMessage)) {
          startTransition(() => {
            action();
          });
        }
      }}
      className={`${className} disabled:opacity-50`}
    >
      {isPending ? "…" : label}
    </button>
  );
}
