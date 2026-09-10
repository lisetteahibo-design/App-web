import Link from "next/link";

export default function MobileHeader() {
  return (
    <header className="md:hidden sticky top-0 z-20 bg-white border-b border-gray-200">
      <div className="flex items-center gap-3 px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo-mark.svg" alt="EDEN Capital" width={32} height={32} />
          <span className="text-sm font-semibold tracking-wide text-navy-900">TRS TRANSACTIONS</span>
        </Link>
      </div>
      <nav className="flex items-center gap-1 px-3 pb-3 text-xs">
        <Link href="/" className="rounded-md px-3 py-1.5 bg-gray-100 text-navy-800 hover:bg-gray-200">
          Tableau de bord
        </Link>
        <Link href="/transactions" className="rounded-md px-3 py-1.5 bg-gray-100 text-navy-800 hover:bg-gray-200">
          Transactions
        </Link>
        <Link href="/transactions/new" className="rounded-md px-3 py-1.5 bg-gray-100 text-navy-800 hover:bg-gray-200">
          Nouvelle
        </Link>
      </nav>
    </header>
  );
}
