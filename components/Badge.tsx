const STATUT_STYLES: Record<string, string> = {
  "En préparation": "bg-gray-100 text-gray-700 ring-gray-300",
  "En cours": "bg-navy-50 text-navy-800 ring-navy-200",
  Suspendue: "bg-amber-50 text-amber-700 ring-amber-200",
  Clôturée: "bg-emerald-50 text-emerald-700 ring-emerald-200",

  "À faire": "bg-gray-100 text-gray-700 ring-gray-300",
  Bloqué: "bg-red-50 text-red-700 ring-red-200",
  Terminé: "bg-emerald-50 text-emerald-700 ring-emerald-200",

  "À venir": "bg-navy-50 text-navy-800 ring-navy-200",
  "Lettre envoyée": "bg-sky-50 text-sky-700 ring-sky-200",
  Réalisée: "bg-emerald-50 text-emerald-700 ring-emerald-200",
  "En retard": "bg-red-50 text-red-700 ring-red-200",
  Annulée: "bg-gray-100 text-gray-500 ring-gray-300",

  Brouillon: "bg-gray-100 text-gray-700 ring-gray-300",
  Envoyé: "bg-sky-50 text-sky-700 ring-sky-200",
  Reçu: "bg-navy-50 text-navy-800 ring-navy-200",
  Archivé: "bg-emerald-50 text-emerald-700 ring-emerald-200",
};

export default function Badge({ children }: { children: string }) {
  const style = STATUT_STYLES[children] ?? "bg-gray-100 text-gray-700 ring-gray-300";
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ring-1 ring-inset ${style}`}>
      {children}
    </span>
  );
}
